"""Pydantic schemas for Dataset requests and responses"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DatasetBase(BaseModel):
    """Base dataset schema"""
    openneuro_id: str
    name: str
    description: Optional[str] = None
    snapshot_tag: Optional[str] = None
    dataset_doi: Optional[str] = None


class DatasetCreate(DatasetBase):
    """Schema for creating a dataset"""
    pass


class DatasetResponse(DatasetBase):
    """Schema for dataset response"""
    id: int
    is_synced: bool
    last_synced_at: Optional[datetime] = None
    participant_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DatasetSyncRequest(BaseModel):
    """Schema for dataset sync request"""
    openneuro_id: str
    snapshot_tag: Optional[str] = None


class DatasetSyncResponse(BaseModel):
    """Schema for dataset sync response"""
    status: str
    dataset_id: Optional[int] = None
    openneuro_id: str
    participants_synced: Optional[int] = None
    message: Optional[str] = None
