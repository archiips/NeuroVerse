"""API router for dataset query endpoints - REAL DATA FROM OPENNEURO"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dataset import Dataset
from app.services.openneuro_service import openneuro_service
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/datasets", tags=["datasets"])


@router.get("/")
async def get_all_datasets(
    skip: int = 0,
    limit: int = 1000,
    sort_by: str = "participant_count",
    db: Session = Depends(get_db)
):
    """Get all OpenNeuro datasets - REAL DATA, sorted by default"""
    try:
        # Default sort by participant count (descending) to show largest studies first
        query = db.query(Dataset)
        
        if sort_by == "name":
            query = query.order_by(Dataset.name)
        else:  # Default: participant_count descending
            query = query.order_by(Dataset.participant_count.desc())
        
        datasets = query.offset(skip).limit(limit).all()

        return [
            {
                "id": ds.id,
                "openneuro_id": ds.openneuro_id,
                "name": ds.name or ds.openneuro_id,
                "description": ds.description or "No description available",
                "participant_count": ds.participant_count,
                "tasks": ds.tasks,
                "modality": ds.modality or "fMRI"
            }
            for ds in datasets
        ]
    except Exception as e:
        logger.error(f"Error fetching datasets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{dataset_id}")
async def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    """Get specific dataset by ID"""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    return {
        "id": dataset.id,
        "openneuro_id": dataset.openneuro_id,
        "name": dataset.name or dataset.openneuro_id,
        "description": dataset.description,
        "participant_count": dataset.participant_count,
        "tasks": dataset.tasks,
        "modality": dataset.modality
    }


@router.get("/{openneuro_id}/summary-stats")
async def get_summary_stats(openneuro_id: str, db: Session = Depends(get_db)):
    """Get REAL summary statistics from OpenNeuro participants.tsv"""
    try:
        logger.info(f"Fetching REAL participant data for: {openneuro_id}")
        
        # Get real participant data from OpenNeuro
        demographics = openneuro_service.get_participants_data(openneuro_id)
        
        if not demographics:
            raise HTTPException(
                status_code=404, 
                detail="No participant demographics available. This dataset may not have a participants.tsv file."
            )
        
        logger.info(f"Returning REAL data for {openneuro_id}: {demographics.get('total_participants')} participants")
        
        return {
            "success": True,
            "data": demographics
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching summary stats for {openneuro_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
