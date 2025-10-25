"""Pydantic schemas for Participant requests and responses"""
from pydantic import BaseModel
from typing import Optional


class ParticipantBase(BaseModel):
    """Base participant schema"""
    participant_id: str
    age: Optional[float] = None
    sex: Optional[str] = None
    diagnosis: Optional[str] = None
    group: Optional[str] = None
    handedness: Optional[str] = None


class ParticipantCreate(ParticipantBase):
    """Schema for creating a participant"""
    dataset_id: int


class ParticipantResponse(ParticipantBase):
    """Schema for participant response"""
    id: int
    dataset_id: int

    class Config:
        from_attributes = True
