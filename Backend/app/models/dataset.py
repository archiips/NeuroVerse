"""Dataset model for storing OpenNeuro dataset metadata"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Dataset(Base):
    """Model for storing dataset metadata from OpenNeuro"""

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    openneuro_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    participant_count = Column(Integer, default=0)
    tasks = Column(Integer, default=0)
    modality = Column(String)
    created_date = Column(DateTime, default=datetime.utcnow)
    updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Metadata
    publication_year = Column(Integer)
    version = Column(String)

    def __repr__(self):
        return f"<Dataset(id={self.id}, openneuro_id='{self.openneuro_id}', name='{self.name}')>"
