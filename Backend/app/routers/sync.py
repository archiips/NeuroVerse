"""API router for dataset synchronization endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import asyncio
import logging

from app.database import get_db  # Changed from app.database.connection
from app.models.dataset import Dataset
from app.services.data_sync_service import DataSyncService
from app.services.nda_service import nda_service
from app.services.scheduler_service import get_scheduler_status, trigger_sync_now
from app.schemas.dataset import DatasetSyncRequest, DatasetSyncResponse
from app.data.curated_datasets import CURATED_DATASETS

logger = logging.getLogger(__name__)

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
    1. Fetch dataset metadata from OpenNeuro GraphQL API
    2. Download participants.tsv file
    3. Parse and store participant data locally in SQLite

    Args:
        request: DatasetSyncRequest with openneuro_id and optional snapshot_tag
        db: Database session

    Returns:
        DatasetSyncResponse with sync status and details
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


@router.post("/curated-datasets", response_model=Dict)
async def sync_curated_datasets(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Sync curated popular datasets from OpenNeuro.
    This endpoint pre-loads a set of popular, high-quality datasets
    so users can browse data immediately without manual syncing.

    Args:
        limit: Maximum number of datasets to sync (default: 10)
        db: Database session

    Returns:
        Summary of sync operations with success/failure counts
    """
    datasets_to_sync = CURATED_DATASETS[:limit]
    results = {
        "total": len(datasets_to_sync),
        "successful": 0,
        "failed": 0,
        "details": []
    }

    for dataset_info in datasets_to_sync:
        sync_service = DataSyncService(db)
        try:
            result = await sync_service.sync_dataset(
                openneuro_id=dataset_info["openneuro_id"],
                snapshot_tag=dataset_info.get("snapshot_tag")
            )
            results["successful"] += 1
            results["details"].append({
                "openneuro_id": dataset_info["openneuro_id"],
                "status": "success",
                "participants": result.get("participants_synced", 0),
                "message": f"Synced {result.get('participants_synced', 0)} participants"
            })
        except Exception as e:
            results["failed"] += 1
            results["details"].append({
                "openneuro_id": dataset_info["openneuro_id"],
                "status": "failed",
                "error": str(e)
            })
        finally:
            await sync_service.close()

    return results


@router.get("/curated-list", response_model=List[Dict])
async def get_curated_list():
    """
    Get list of curated datasets available for syncing.
    Returns metadata about recommended datasets without syncing them.
    """
    return CURATED_DATASETS


@router.get("/scheduler/status", response_model=Dict)
async def get_sync_scheduler_status():
    """
    Get the status of the automated daily sync scheduler.
    Shows when the next sync is scheduled to run.
    """
    return get_scheduler_status()


@router.post("/scheduler/trigger", response_model=Dict)
async def trigger_manual_sync():
    """
    Manually trigger a re-sync of all datasets immediately.
    This bypasses the scheduled time and runs the sync job now.
    """
    try:
        await trigger_sync_now()
        return {
            "status": "success",
            "message": "Manual sync completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
