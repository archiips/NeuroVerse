# NeuroVerse Backend Design - OpenNeuro API Integration

## Overview
This backend will fetch real neuroscience dataset metadata from OpenNeuro's GraphQL API, parse participant data, store it locally for fast querying, and serve aggregated statistics to the frontend.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      OpenNeuro GraphQL API                       │
│              https://openneuro.org/crn/graphql                  │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │ GraphQL Queries
                                │ (Fetch dataset metadata & files)
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                    FastAPI Backend Layer                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  OpenNeuro Service (GraphQL Client)                      │   │
│  │  - Fetch dataset list                                    │   │
│  │  - Fetch participants.tsv file                           │   │
│  │  - Parse TSV with Pandas                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database Layer (SQLAlchemy + SQLite)                    │   │
│  │  - Cache dataset metadata                                │   │
│  │  - Store parsed participant data                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Statistics Service                                       │   │
│  │  - Aggregate by diagnosis, sex, age                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  REST API Endpoints                                       │   │
│  │  GET /api/v1/datasets                                    │   │
│  │  GET /api/v1/datasets/{id}/stats/summary                 │   │
│  │  POST /api/v1/datasets/sync/{dataset_id}                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        React Frontend
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                          # FastAPI app initialization
│   ├── config.py                        # Configuration settings
│   │
│   ├── models/                          # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   ├── participant.py
│   │   └── sync_log.py
│   │
│   ├── schemas/                         # Pydantic request/response models
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   ├── participant.py
│   │   └── statistics.py
│   │
│   ├── services/                        # Business logic layer
│   │   ├── __init__.py
│   │   ├── openneuro_service.py        # GraphQL client for OpenNeuro
│   │   ├── data_sync_service.py        # Sync datasets from OpenNeuro
│   │   ├── participant_parser.py       # Parse participants.tsv
│   │   └── statistics_service.py       # Calculate aggregations
│   │
│   ├── routers/                         # API endpoints
│   │   ├── __init__.py
│   │   ├── datasets.py
│   │   └── sync.py
│   │
│   └── database/
│       ├── __init__.py
│       └── connection.py                # Database session management
│
├── data/                                # Cache for downloaded TSV files
│   └── .gitkeep
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## Database Schema

### 1. Dataset Table
Stores metadata about OpenNeuro datasets.

```python
# app/models/dataset.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # OpenNeuro dataset ID (e.g., "ds000224")
    openneuro_id = Column(String(50), unique=True, nullable=False, index=True)

    # Dataset metadata from OpenNeuro
    name = Column(String(500), nullable=False)
    description = Column(String(2000), nullable=True)
    snapshot_tag = Column(String(50), nullable=True)  # e.g., "1.0.1"
    dataset_doi = Column(String(200), nullable=True)

    # Sync status
    is_synced = Column(Boolean, default=False)
    last_synced_at = Column(DateTime, nullable=True)
    participant_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    participants = relationship("Participant", back_populates="dataset", cascade="all, delete-orphan")
    sync_logs = relationship("SyncLog", back_populates="dataset", cascade="all, delete-orphan")
```

### 2. Participant Table
Stores individual participant metadata from participants.tsv files.

```python
# app/models/participant.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False, index=True)

    # Participant data from TSV
    participant_id = Column(String(100), nullable=False)  # e.g., "sub-01"
    age = Column(Float, nullable=True)
    sex = Column(String(10), nullable=True)  # M, F, or other
    diagnosis = Column(String(200), nullable=True)

    # Additional flexible columns for other metadata
    # (OpenNeuro datasets may have different columns)
    group = Column(String(100), nullable=True)
    handedness = Column(String(20), nullable=True)

    # Relationship
    dataset = relationship("Dataset", back_populates="participants")
```

### 3. SyncLog Table
Tracks synchronization history for debugging.

```python
# app/models/sync_log.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)

    status = Column(String(20), nullable=False)  # "success", "failed", "partial"
    participants_synced = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    synced_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    dataset = relationship("Dataset", back_populates="sync_logs")
```

---

## Core Services

### 1. OpenNeuro GraphQL Client

```python
# app/services/openneuro_service.py
import httpx
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class OpenNeuroService:
    """Client for interacting with OpenNeuro GraphQL API"""

    GRAPHQL_ENDPOINT = "https://openneuro.org/crn/graphql"

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)

    async def get_dataset_info(self, dataset_id: str, snapshot_tag: Optional[str] = None) -> Dict:
        """
        Fetch dataset metadata from OpenNeuro

        Args:
            dataset_id: OpenNeuro dataset ID (e.g., "ds000224")
            snapshot_tag: Specific snapshot version (e.g., "1.0.1"), defaults to latest

        Returns:
            Dictionary with dataset metadata
        """
        if snapshot_tag:
            query = """
            query GetDatasetSnapshot($datasetId: ID!, $tag: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                id
                tag
                description {
                  Name
                  DatasetDOI
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag}
        else:
            query = """
            query GetDataset($id: ID!) {
              dataset(id: $id) {
                id
                name
                latestSnapshot {
                  tag
                  description {
                    Name
                    DatasetDOI
                  }
                }
              }
            }
            """
            variables = {"id": dataset_id}

        response = await self.client.post(
            self.GRAPHQL_ENDPOINT,
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        return response.json()

    async def get_file_tree(self, dataset_id: str, snapshot_tag: str, tree_id: Optional[str] = None) -> List[Dict]:
        """
        Fetch file tree for a dataset snapshot

        Args:
            dataset_id: OpenNeuro dataset ID
            snapshot_tag: Snapshot version
            tree_id: Optional tree ID for subdirectories

        Returns:
            List of files/directories
        """
        if tree_id:
            query = """
            query GetFiles($datasetId: ID!, $tag: String!, $tree: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                files(tree: $tree) {
                  id
                  key
                  filename
                  size
                  directory
                  annexed
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag, "tree": tree_id}
        else:
            query = """
            query GetFiles($datasetId: ID!, $tag: String!) {
              snapshot(datasetId: $datasetId, tag: $tag) {
                files {
                  id
                  key
                  filename
                  size
                  directory
                  annexed
                }
              }
            }
            """
            variables = {"datasetId": dataset_id, "tag": snapshot_tag}

        response = await self.client.post(
            self.GRAPHQL_ENDPOINT,
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        return data["data"]["snapshot"]["files"]

    async def find_participants_file(self, dataset_id: str, snapshot_tag: str) -> Optional[str]:
        """
        Find the participants.tsv file in the dataset

        Returns:
            File key for participants.tsv or None if not found
        """
        files = await self.get_file_tree(dataset_id, snapshot_tag)

        for file in files:
            if file["filename"] == "participants.tsv" and not file["directory"]:
                return file["key"]

        return None

    async def download_participants_file(self, dataset_id: str, snapshot_tag: str, file_key: str) -> bytes:
        """
        Download participants.tsv file content

        Args:
            dataset_id: OpenNeuro dataset ID
            snapshot_tag: Snapshot version
            file_key: File key from file tree

        Returns:
            File content as bytes
        """
        # OpenNeuro file download URL pattern
        download_url = f"https://openneuro.org/crn/datasets/{dataset_id}/snapshots/{snapshot_tag}/files/{file_key}"

        response = await self.client.get(download_url)
        response.raise_for_status()
        return response.content

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
```

### 2. Data Sync Service

```python
# app/services/data_sync_service.py
import pandas as pd
from io import StringIO
from sqlalchemy.orm import Session
from typing import Dict
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
                return {"status": "failed", "message": error_msg}

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
                participant = Participant(
                    dataset_id=dataset.id,
                    participant_id=row.get('participant_id', ''),
                    age=self._safe_float(row.get('age')),
                    sex=self._safe_str(row.get('sex')),
                    diagnosis=self._safe_str(row.get('diagnosis')),
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
```

---

## API Endpoints

### Sync Router

```python
# app/routers/sync.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.services.data_sync_service import DataSyncService
from app.schemas.dataset import DatasetSyncRequest, DatasetSyncResponse

router = APIRouter(
    prefix="/api/v1/sync",
    tags=["sync"]
)

@router.post("/dataset", response_model=DatasetSyncResponse)
async def sync_dataset_from_openneuro(
    request: DatasetSyncRequest,
    db: Session = Depends(get_db)
):
    """
    Sync a dataset from OpenNeuro to local database

    This will:
    1. Fetch dataset metadata from OpenNeuro
    2. Download participants.tsv file
    3. Parse and store participant data locally
    """
    sync_service = DataSyncService(db)

    try:
        result = await sync_service.sync_dataset(
            openneuro_id=request.openneuro_id,
            snapshot_tag=request.snapshot_tag
        )
        return DatasetSyncResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await sync_service.close()
```

---

## Configuration

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./neuroverse.db"

    # OpenNeuro API
    openneuro_graphql_url: str = "https://openneuro.org/crn/graphql"

    # API Settings
    api_title: str = "NeuroVerse API"
    api_version: str = "1.0.0"

    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pandas==2.1.3
pydantic==2.5.0
pydantic-settings==2.1.0
httpx==0.25.2
python-multipart==0.0.6
```

---

## Next Steps

1. **Initial Setup**: Create the project structure and install dependencies
2. **Database Models**: Implement SQLAlchemy models for Dataset, Participant, SyncLog
3. **OpenNeuro Service**: Build the GraphQL client
4. **Sync Service**: Implement data synchronization logic
5. **API Endpoints**: Create REST endpoints for syncing and querying
6. **Testing**: Test with real OpenNeuro datasets like ds000224

Would you like me to start implementing any specific part of this backend?
