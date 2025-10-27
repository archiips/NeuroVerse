"""
Extended database seeding script with more OpenNeuro datasets
Run with: python scripts/seed_extended_datasets.py
"""

from app import app, db
from models.dataset import Dataset
from services.openneuro_parser import OpenNeuroParser
from config.featured_datasets import FEATURED_DATASETS
import sys

EXTENDED_DATASETS = [
    # Featured datasets from config
    *FEATURED_DATASETS,
    
    # Additional high-quality datasets
    {
        "openneuro_id": "ds000102",
        "name": "Flanker Task (Cognitive Control)",
        "description": "fMRI data from flanker task measuring cognitive control",
        "has_diagnosis": False,
        "has_demographics": True,
        "participant_count": 26,
        "quality": "complete",
        "modality": "fMRI",
        "tasks": 1
    },
    {
        "openneuro_id": "ds000105",
        "name": "Visual Object Recognition",
        "description": "fMRI study of visual object recognition",
        "has_diagnosis": False,
        "has_demographics": True,
        "participant_count": 6,
        "quality": "partial",
        "modality": "fMRI",
        "tasks": 2
    },
    {
        "openneuro_id": "ds000109",
        "name": "False Belief Task",
        "description": "fMRI data from false belief theory of mind task",
        "has_diagnosis": False,
        "has_demographics": True,
        "participant_count": 11,
        "quality": "complete",
        "modality": "fMRI",
        "tasks": 1
    },
    {
        "openneuro_id": "ds000113",
        "name": "Forrest Gump Movie Watching",
        "description": "High-resolution fMRI data from movie watching",
        "has_diagnosis": False,
        "has_demographics": True,
        "participant_count": 20,
        "quality": "complete",
        "modality": "fMRI, T1w, T2w",
        "tasks": 8
    },
    {
        "openneuro_id": "ds000117",
        "name": "Multi-Subject Multi-Modal Face Processing",
        "description": "MEG and fMRI data from face processing tasks",
        "has_diagnosis": False,
        "has_demographics": True,
        "participant_count": 19,
        "quality": "complete",
        "modality": "MEG, fMRI",
        "tasks": 3
    }
]


def seed_dataset(dataset_info, auto_parse=True):
    """
    Seed a single dataset into the database
    
    Args:
        dataset_info: Dictionary with dataset information
        auto_parse: Whether to automatically parse participants.tsv
    """
    openneuro_id = dataset_info['openneuro_id']
    
    # Check if already exists
    existing = Dataset.query.filter_by(openneuro_id=openneuro_id).first()
    
    if existing:
        print(f"⏭️  Skipping {openneuro_id} - already exists")
        return existing
    
    # Create new dataset
    dataset = Dataset(
        openneuro_id=openneuro_id,
        name=dataset_info['name'],
        description=dataset_info['description'],
        participant_count=dataset_info['participant_count'],
        modality=dataset_info['modality'],
        data_quality=dataset_info['quality'],
        available_stats=['age', 'sex'] + (['diagnosis'] if dataset_info.get('has_diagnosis') else []),
        confidence='high' if dataset_info['quality'] == 'complete' else 'estimated',
        is_featured=dataset_info in FEATURED_DATASETS
    )
    
    db.session.add(dataset)
    print(f"✅ Added {openneuro_id}: {dataset_info['name']}")
    
    # Optionally auto-parse participants.tsv
    if auto_parse:
        try:
            print(f"   📊 Parsing participants.tsv for {openneuro_id}...")
            df = OpenNeuroParser.fetch_participants_tsv(openneuro_id)
            
            if df is not None and len(df) > 0:
                stats = OpenNeuroParser.process_participants_data(df)
                
                # Update with parsed data
                dataset.participant_count = stats['total_participants']
                dataset.data_quality = stats['data_quality']
                dataset.available_stats = stats['available_stats']
                dataset.confidence = stats['confidence']
                
                print(f"   ✓ Parsed: {stats['total_participants']} participants, "
                      f"quality={stats['data_quality']}, "
                      f"stats={stats['available_stats']}")
            else:
                print(f"   ⚠️  No participants.tsv found")
        except Exception as e:
            print(f"   ❌ Parse failed: {str(e)}")
    
    return dataset


def seed_all_datasets(auto_parse=True):
    """
    Seed all extended datasets
    
    Args:
        auto_parse: Whether to automatically parse participants.tsv for each
    """
    with app.app_context():
        print("\n🌱 Starting database seeding...\n")
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for dataset_info in EXTENDED_DATASETS:
            try:
                result = seed_dataset(dataset_info, auto_parse)
                if result:
                    success_count += 1
                else:
                    skip_count += 1
            except Exception as e:
                error_count += 1
                print(f"❌ Error seeding {dataset_info['openneuro_id']}: {str(e)}")
        
        # Commit all changes
        try:
            db.session.commit()
            print(f"\n✅ Seeding complete!")
            print(f"   - Successfully added: {success_count}")
            print(f"   - Skipped (existing): {skip_count}")
            print(f"   - Errors: {error_count}")
            print(f"   - Total in database: {Dataset.query.count()}")
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Database commit failed: {str(e)}")
            sys.exit(1)


def reseed_dataset(openneuro_id, force_reparse=True):
    """
    Re-seed a specific dataset (useful for updates)
    
    Args:
        openneuro_id: OpenNeuro dataset ID (e.g., 'ds000030')
        force_reparse: Whether to force re-parsing participants.tsv
    """
    with app.app_context():
        dataset = Dataset.query.filter_by(openneuro_id=openneuro_id).first()
        
        if not dataset:
            print(f"❌ Dataset {openneuro_id} not found in database")
            return
        
        if force_reparse:
            print(f"🔄 Re-parsing {openneuro_id}...")
            try:
                df = OpenNeuroParser.fetch_participants_tsv(openneuro_id)
                
                if df is not None:
                    stats = OpenNeuroParser.process_participants_data(df)
                    
                    # Update dataset
                    dataset.participant_count = stats['total_participants']
                    dataset.data_quality = stats['data_quality']
                    dataset.available_stats = stats['available_stats']
                    dataset.confidence = stats['confidence']
                    
                    db.session.commit()
                    print(f"✅ Updated {openneuro_id}")
                else:
                    print(f"❌ Failed to fetch participants.tsv")
            except Exception as e:
                print(f"❌ Error: {str(e)}")
                db.session.rollback()


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Seed OpenNeuro datasets')
    parser.add_argument('--no-parse', action='store_true', 
                       help='Skip automatic TSV parsing')
    parser.add_argument('--reseed', type=str, metavar='DATASET_ID',
                       help='Re-seed a specific dataset (e.g., ds000030)')
    
    args = parser.parse_args()
    
    if args.reseed:
        reseed_dataset(args.reseed)
    else:
        seed_all_datasets(auto_parse=not args.no_parse)
