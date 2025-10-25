"""API router for dataset query endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.dataset import Dataset
from app.models.participant import Participant
from app.services.statistics_service import StatisticsService
from app.schemas.dataset import DatasetResponse
from app.schemas.participant import ParticipantResponse
from app.schemas.statistics import CategoryCount, AgeBin, SummaryStatistics

router = APIRouter(
    prefix="/api/v1",
    tags=["datasets"]
)


@router.get("/datasets", response_model=List[DatasetResponse])
def get_all_datasets(db: Session = Depends(get_db)):
    """
    Get all available datasets

    Returns:
        List of all datasets in the database
    """
    datasets = db.query(Dataset).all()
    return datasets


@router.get("/datasets/{dataset_id}", response_model=DatasetResponse)
def get_dataset_by_id(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get a specific dataset by ID

    Args:
        dataset_id: Internal dataset ID

    Returns:
        Dataset details

    Raises:
        HTTPException: 404 if dataset not found
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.get("/datasets/{dataset_id}/stats/diagnosis", response_model=List[CategoryCount])
def get_diagnosis_stats(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get diagnosis distribution for a dataset

    Args:
        dataset_id: Internal dataset ID

    Returns:
        List of diagnosis categories with counts

    Raises:
        HTTPException: 404 if dataset not found
    """
    # Verify dataset exists
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    stats_service = StatisticsService(db)
    return stats_service.count_by_diagnosis(dataset_id)


@router.get("/datasets/{dataset_id}/stats/sex", response_model=List[CategoryCount])
def get_sex_stats(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get sex distribution for a dataset

    Args:
        dataset_id: Internal dataset ID

    Returns:
        List of sex categories with counts

    Raises:
        HTTPException: 404 if dataset not found
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    stats_service = StatisticsService(db)
    return stats_service.count_by_sex(dataset_id)


@router.get("/datasets/{dataset_id}/stats/age-distribution", response_model=List[AgeBin])
def get_age_distribution(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get age distribution for a dataset

    Args:
        dataset_id: Internal dataset ID

    Returns:
        List of age bins with counts

    Raises:
        HTTPException: 404 if dataset not found
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    stats_service = StatisticsService(db)
    return stats_service.get_age_distribution(dataset_id)


@router.get("/datasets/{dataset_id}/stats/summary", response_model=SummaryStatistics)
def get_summary_stats(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get complete summary statistics for a dataset

    Args:
        dataset_id: Internal dataset ID

    Returns:
        Complete summary statistics including diagnosis, sex, and age distribution

    Raises:
        HTTPException: 404 if dataset not found
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    stats_service = StatisticsService(db)
    return stats_service.get_summary_statistics(dataset_id)


@router.get("/datasets/{dataset_id}/participants", response_model=List[ParticipantResponse])
def get_dataset_participants(dataset_id: int, db: Session = Depends(get_db)):
    """
    Get all participants for a dataset

    Args:
        dataset_id: Internal dataset ID

    Returns:
        List of all participants in the dataset

    Raises:
        HTTPException: 404 if dataset not found
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    participants = db.query(Participant).filter(
        Participant.dataset_id == dataset_id
    ).all()

    return participants
