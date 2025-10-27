"""
Simple test script to verify featured datasets configuration
No database connection needed
"""

try:
    from config.featured_datasets import (
        FEATURED_DATASETS, 
        TOTAL_FEATURED, 
        TOTAL_PARTICIPANTS,
        get_all_categories
    )
    
    print("\n✅ Featured Datasets Configuration Loaded Successfully!\n")
    print(f"📊 Total Featured Datasets: {TOTAL_FEATURED}")
    print(f"👥 Total Participants: {TOTAL_PARTICIPANTS:,}")
    print(f"\n📁 Categories:")
    
    for category in get_all_categories():
        count = len([ds for ds in FEATURED_DATASETS if ds.get('category') == category])
        print(f"   - {category}: {count} datasets")
    
    print(f"\n📋 All Datasets:")
    for i, ds in enumerate(FEATURED_DATASETS, 1):
        print(f"   {i:2d}. {ds['openneuro_id']} - {ds['name']} ({ds['participant_count']} participants)")
    
    print(f"\n✅ All {TOTAL_FEATURED} datasets loaded successfully!")
    
except ImportError as e:
    print(f"\n❌ Error importing configuration: {e}")
    print("\nMake sure you created the file:")
    print("   config/featured_datasets.py")
except Exception as e:
    print(f"\n❌ Unexpected error: {e}")
