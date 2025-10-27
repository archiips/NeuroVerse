"""
FastAPI Database Seeding Script for Featured Datasets
Run with: python3 scripts/seed_datasets.py
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine, Base
from app.models.dataset import Dataset
from config.featured_datasets import FEATURED_DATASETS
from datetime import datetime

def init_db():
    """Initialize database tables if they don't exist"""
    print("🔧 Checking database tables...")
    
    # Import all models to ensure they're registered
    from app.models import dataset, participant, sync_log
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ready\n")

def seed_datasets():
    """Seed featured datasets into the database"""
    db = SessionLocal()
    
    try:
        print("🌱 Starting database seeding...\n")
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for ds_info in FEATURED_DATASETS:
            try:
                openneuro_id = ds_info['openneuro_id']
                
                # Check if dataset already exists
                existing = db.query(Dataset).filter(
                    Dataset.openneuro_id == openneuro_id
                ).first()
                
                if existing:
                    print(f"⏭️  Skipping {openneuro_id} - already exists")
                    skip_count += 1
                    continue
                
                # Create new dataset
                new_dataset = Dataset(
                    openneuro_id=openneuro_id,
                    name=ds_info['name'],
                    description=ds_info['description'],
                    participant_count=ds_info['participant_count'],
                    is_synced=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                
                db.add(new_dataset)
                print(f"✅ Added {openneuro_id}: {ds_info['name']} ({ds_info['participant_count']} participants)")
                success_count += 1
                
            except Exception as e:
                error_count += 1
                print(f"❌ Error seeding {ds_info['openneuro_id']}: {str(e)}")
        
        # Commit all changes
        db.commit()
        
        print(f"\n{'='*60}")
        print(f"✅ Seeding complete!")
        print(f"   - Successfully added: {success_count}")
        print(f"   - Skipped (existing): {skip_count}")
        print(f"   - Errors: {error_count}")
        print(f"   - Total in database: {db.query(Dataset).count()}")
        print(f"{'='*60}\n")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Database operation failed: {str(e)}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🏥 NEUROVERSE DATABASE SEEDING")
    print("="*60 + "\n")
    
    init_db()
    seed_datasets()
    
    print("✅ All done! Your database now has 26 featured datasets.\n")
