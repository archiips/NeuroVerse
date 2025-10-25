"""Participant model for storing individual participant metadata"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Participant(Base):
    """Model for storing participant metadata from participants.tsv files"""

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

    def __repr__(self):
        return f"<Participant(id={self.id}, participant_id='{self.participant_id}', dataset_id={self.dataset_id})>"
