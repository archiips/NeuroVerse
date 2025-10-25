"""Dataset model for storing OpenNeuro dataset metadata"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base


class Dataset(Base):
    """Model for storing dataset metadata from OpenNeuro"""

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

    def __repr__(self):
        return f"<Dataset(id={self.id}, openneuro_id='{self.openneuro_id}', name='{self.name}')>"
