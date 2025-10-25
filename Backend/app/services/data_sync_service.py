"""Service for syncing datasets from OpenNeuro to local database"""
import pandas as pd
from io import StringIO
from sqlalchemy.orm import Session
from typing import Dict, Optional
import logging
from datetime import datetime

from app.services.openneuro_service import OpenNeuroService
from app.models.dataset import Dataset
from app.models.participant import Participant
from app.models.sync_log import SyncLog

logger = logging.getLogger(__name__)


class DataSyncService:
    """Service for syncing datasets from OpenNeuro to local database"""

    def __init__(self, db: Session):
        self.db = db
        self.openneuro = OpenNeuroService()

    async def sync_dataset(self, openneuro_id: str, snapshot_tag: Optional[str] = None) -> Dict:
        """
        Sync a dataset from OpenNeuro to local database

        Args:
            openneuro_id: OpenNeuro dataset ID (e.g., "ds000224")
            snapshot_tag: Optional specific snapshot version

        Returns:
            Sync status dictionary
        """
        dataset = None
        try:
            logger.info(f"Starting sync for dataset {openneuro_id}")

            # 1. Fetch dataset metadata
            dataset_info = await self.openneuro.get_dataset_info(openneuro_id, snapshot_tag)

            # Extract metadata
            if snapshot_tag:
                snapshot_data = dataset_info["data"]["snapshot"]
                name = snapshot_data["description"]["Name"]
                doi = snapshot_data["description"].get("DatasetDOI")
                tag = snapshot_data["tag"]
            else:
                dataset_data = dataset_info["data"]["dataset"]
                latest_snapshot = dataset_data["latestSnapshot"]
                name = latest_snapshot["description"]["Name"]
                doi = latest_snapshot["description"].get("DatasetDOI")
                tag = latest_snapshot["tag"]

            # 2. Create or update dataset record
            dataset = self.db.query(Dataset).filter(
                Dataset.openneuro_id == openneuro_id
            ).first()

            if not dataset:
                dataset = Dataset(
                    openneuro_id=openneuro_id,
                    name=name,
                    snapshot_tag=tag,
                    dataset_doi=doi
                )
                self.db.add(dataset)
            else:
                dataset.name = name
                dataset.snapshot_tag = tag
                dataset.dataset_doi = doi

            self.db.commit()
            self.db.refresh(dataset)

            # 3. Find and download participants.tsv
            file_key = await self.openneuro.find_participants_file(openneuro_id, tag)

            if not file_key:
                error_msg = f"participants.tsv not found for dataset {openneuro_id}"
                logger.error(error_msg)
                self._log_sync(dataset.id, "failed", 0, error_msg)
                return {"status": "failed", "openneuro_id": openneuro_id, "message": error_msg}

            # 4. Download and parse participants file
            file_content = await self.openneuro.download_participants_file(
                openneuro_id, tag, file_key
            )

            # Parse TSV with pandas
            df = pd.read_csv(StringIO(file_content.decode('utf-8')), sep='\t')

            # 5. Clear existing participants for this dataset
            self.db.query(Participant).filter(
                Participant.dataset_id == dataset.id
            ).delete()

            # 6. Insert new participants
            participants_added = 0
            for _, row in df.iterrows():
                # Map different column names used by different datasets
                # Some use 'gender', some use 'sex'
                # Normalize sex values to M/F/Other
                raw_sex = row.get('sex') if pd.notna(row.get('sex')) else row.get('gender')
                sex_value = self._normalize_sex(raw_sex)

                # Some datasets use 'diagnosis', others use 'group' or 'education_degree'
                diagnosis_value = (
                    self._safe_str(row.get('diagnosis')) or
                    self._safe_str(row.get('group')) or
                    self._safe_str(row.get('education_degree')) or
                    'Healthy'  # Default if no category found
                )

                participant = Participant(
                    dataset_id=dataset.id,
                    participant_id=row.get('participant_id', ''),
                    age=self._safe_float(row.get('age')),
                    sex=sex_value,
                    diagnosis=diagnosis_value,
                    group=self._safe_str(row.get('group')),
                    handedness=self._safe_str(row.get('handedness'))
                )
                self.db.add(participant)
                participants_added += 1

            # 7. Update dataset sync status
            dataset.is_synced = True
            dataset.last_synced_at = datetime.utcnow()
            dataset.participant_count = participants_added

            self.db.commit()

            # 8. Log successful sync
            self._log_sync(dataset.id, "success", participants_added, None)

            logger.info(f"Successfully synced {participants_added} participants for {openneuro_id}")

            return {
                "status": "success",
                "dataset_id": dataset.id,
                "openneuro_id": openneuro_id,
                "participants_synced": participants_added
            }

        except Exception as e:
            logger.error(f"Error syncing dataset {openneuro_id}: {str(e)}")
            if dataset:
                self._log_sync(dataset.id, "failed", 0, str(e))
            self.db.rollback()
            raise

    def _safe_float(self, value) -> Optional[float]:
        """Safely convert value to float"""
        try:
            return float(value) if pd.notna(value) else None
        except (ValueError, TypeError):
            return None

    def _safe_str(self, value) -> Optional[str]:
        """Safely convert value to string"""
        return str(value) if pd.notna(value) else None

    def _normalize_sex(self, value) -> Optional[str]:
        """Normalize sex/gender values to consistent format"""
        if pd.isna(value) or value is None:
            return None

        # Convert to string and clean up
        sex_str = str(value).strip().upper()

        # Remove trailing punctuation (commas, periods, etc.)
        sex_str = sex_str.rstrip('.,;')

        # Map common variations to standard values
        if sex_str in ['M', 'MALE', 'MAN']:
            return 'M'
        elif sex_str in ['F', 'FEMALE', 'WOMAN']:
            return 'F'
        elif sex_str in ['O', 'OTHER', 'X', 'NON-BINARY', 'NONBINARY']:
            return 'Other'
        else:
            # If we can't normalize, return None instead of Unknown
            return None

    def _log_sync(self, dataset_id: int, status: str, count: int, error: Optional[str]):
        """Log sync operation"""
        sync_log = SyncLog(
            dataset_id=dataset_id,
            status=status,
            participants_synced=count,
            error_message=error
        )
        self.db.add(sync_log)
        self.db.commit()

    async def close(self):
        """Close OpenNeuro client"""
        await self.openneuro.close()
