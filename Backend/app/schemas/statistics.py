"""Pydantic schemas for statistics responses"""
from pydantic import BaseModel
from typing import List, Optional


class CategoryCount(BaseModel):
    """Schema for categorical data counts (diagnosis, sex, etc.)"""
    label: str
    count: int
    percentage: float = 0.0


class AgeBin(BaseModel):
    """Schema for age distribution bins"""
    bin: str
    count: int


class AgeStats(BaseModel):
    """Age statistics"""
    mean: float
    median: float
    min: float
    max: float


class SummaryStatistics(BaseModel):
    """Complete summary statistics for a dataset"""
    total_participants: int
    total_subjects: int  # Alias for compatibility
    diagnosis: List[CategoryCount]
    sex: List[CategoryCount]
    age_distribution: List[AgeBin]
    age_stats: Optional[AgeStats] = None
