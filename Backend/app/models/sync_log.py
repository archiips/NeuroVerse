"""SyncLog model for tracking dataset synchronization history"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base


class SyncLog(Base):
    """Model for tracking synchronization history"""

    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)

    status = Column(String(20), nullable=False)  # "success", "failed", "partial"
    participants_synced = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    synced_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    dataset = relationship("Dataset", back_populates="sync_logs")

    def __repr__(self):
        return f"<SyncLog(id={self.id}, dataset_id={self.dataset_id}, status='{self.status}')>"
