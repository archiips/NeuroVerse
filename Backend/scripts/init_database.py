#!/usr/bin/env python3
"""
Initialize database with curated datasets from OpenNeuro.
Run this script once to pre-populate the database with popular datasets.

Usage:
    python scripts/init_database.py [--limit N]

Options:
    --limit N    Number of datasets to sync (default: 5)
"""

import sys
import os
import asyncio
import argparse
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database.connection import SessionLocal, engine, Base
from app.services.data_sync_service import DataSyncService
from app.data.curated_datasets import CURATED_DATASETS


async def sync_dataset(dataset_info: dict, db):
    """Sync a single dataset"""
    sync_service = DataSyncService(db)
    try:
        print(f"\n{'='*60}")
        print(f"📥 Syncing: {dataset_info['openneuro_id']}")
        print(f"   Description: {dataset_info['description']}")

        result = await sync_service.sync_dataset(
            openneuro_id=dataset_info["openneuro_id"],
            snapshot_tag=dataset_info.get("snapshot_tag")
        )

        print(f"✅ Success: Synced {result.get('participants_synced', 0)} participants")
        return {
            "openneuro_id": dataset_info["openneuro_id"],
            "status": "success",
            "participants": result.get("participants_synced", 0)
        }
    except Exception as e:
        print(f"❌ Failed: {str(e)}")
        return {
            "openneuro_id": dataset_info["openneuro_id"],
            "status": "failed",
            "error": str(e)
        }
    finally:
        await sync_service.close()


async def init_database(limit: int = 5):
    """Initialize database with curated datasets"""
    print("🚀 NeuroVerse Database Initialization")
    print("="*60)

    # Create database tables first
    print("📁 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

    print(f"📊 Will sync {limit} curated datasets from OpenNeuro")
    print("⏱️  This may take several minutes depending on dataset sizes...")

    db = SessionLocal()
    datasets_to_sync = CURATED_DATASETS[:limit]
    results = {
        "successful": 0,
        "failed": 0,
        "details": []
    }

    try:
        for i, dataset_info in enumerate(datasets_to_sync, 1):
            print(f"\n[{i}/{len(datasets_to_sync)}] Processing dataset...")
            result = await sync_dataset(dataset_info, db)

            if result["status"] == "success":
                results["successful"] += 1
            else:
                results["failed"] += 1

            results["details"].append(result)

        # Print summary
        print("\n" + "="*60)
        print("📊 SYNC SUMMARY")
        print("="*60)
        print(f"✅ Successful: {results['successful']}")
        print(f"❌ Failed: {results['failed']}")
        print(f"📈 Total: {results['successful'] + results['failed']}")

        if results["successful"] > 0:
            print("\n✨ Successfully synced datasets:")
            for detail in results["details"]:
                if detail["status"] == "success":
                    print(f"   • {detail['openneuro_id']}: {detail['participants']} participants")

        if results["failed"] > 0:
            print("\n⚠️  Failed datasets:")
            for detail in results["details"]:
                if detail["status"] == "failed":
                    print(f"   • {detail['openneuro_id']}: {detail.get('error', 'Unknown error')}")

        print("\n" + "="*60)
        print("🎉 Database initialization complete!")
        print(f"🌐 Start the server with: uvicorn app.main:app --reload")
        print("="*60)

    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(
        description="Initialize NeuroVerse database with curated OpenNeuro datasets"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=5,
        help="Number of datasets to sync (default: 5, max: 10)"
    )

    args = parser.parse_args()

    # Validate limit
    if args.limit < 1:
        print("❌ Error: --limit must be at least 1")
        sys.exit(1)
    if args.limit > len(CURATED_DATASETS):
        print(f"⚠️  Warning: --limit exceeds available datasets ({len(CURATED_DATASETS)})")
        args.limit = len(CURATED_DATASETS)

    # Run initialization
    asyncio.run(init_database(args.limit))


if __name__ == "__main__":
    main()
