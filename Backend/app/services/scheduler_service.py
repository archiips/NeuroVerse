"""
Background scheduler service for automated dataset updates.
Updates synced datasets daily to keep data fresh from OpenNeuro.
"""

import logging
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.services.data_sync_service import DataSyncService
from app.models.dataset import Dataset

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = None


async def resync_all_datasets():
    """
    Re-sync all datasets that are currently in the database.
    This updates participant data to reflect any changes in OpenNeuro.
    """
    logger.info("🔄 Starting daily dataset re-sync...")
    start_time = datetime.now()

    db = SessionLocal()
    sync_service = None

    try:
        # Get all datasets
        datasets = db.query(Dataset).all()
        total = len(datasets)

        if total == 0:
            logger.info("📭 No datasets to sync.")
            return

        logger.info(f"📊 Found {total} datasets to re-sync")

        successful = 0
        failed = 0

        for i, dataset in enumerate(datasets, 1):
            try:
                logger.info(f"[{i}/{total}] Re-syncing {dataset.openneuro_id}...")

                sync_service = DataSyncService(db)
                result = await sync_service.sync_dataset(
                    openneuro_id=dataset.openneuro_id,
                    snapshot_tag=dataset.snapshot_tag
                )

                successful += 1
                logger.info(f"✅ {dataset.openneuro_id}: {result.get('participants_synced', 0)} participants")

            except Exception as e:
                failed += 1
                logger.error(f"❌ {dataset.openneuro_id}: {str(e)}")

            finally:
                if sync_service:
                    await sync_service.close()
                    sync_service = None

        # Log summary
        duration = (datetime.now() - start_time).total_seconds()
        logger.info("="*60)
        logger.info(f"✨ Daily sync complete!")
        logger.info(f"   ✅ Successful: {successful}")
        logger.info(f"   ❌ Failed: {failed}")
        logger.info(f"   ⏱️  Duration: {duration:.1f}s")
        logger.info("="*60)

    except Exception as e:
        logger.error(f"❌ Daily sync failed: {str(e)}")

    finally:
        db.close()


def start_scheduler():
    """
    Start the background scheduler for daily dataset updates.
    Runs every day at 2:00 AM (configurable).
    """
    global scheduler

    if scheduler is not None:
        logger.warning("⚠️  Scheduler already running")
        return

    scheduler = AsyncIOScheduler()

    # Schedule daily re-sync at 2:00 AM
    scheduler.add_job(
        resync_all_datasets,
        trigger=CronTrigger(hour=2, minute=0),  # 2:00 AM daily
        id="daily_dataset_sync",
        name="Daily Dataset Re-sync",
        replace_existing=True
    )

    # Optional: Add a job that runs every hour for testing
    # Uncomment for more frequent updates during development
    # scheduler.add_job(
    #     resync_all_datasets,
    #     trigger=CronTrigger(minute=0),  # Every hour
    #     id="hourly_dataset_sync",
    #     name="Hourly Dataset Re-sync (Dev)",
    #     replace_existing=True
    # )

    scheduler.start()
    logger.info("🕐 Scheduler started - Daily sync at 2:00 AM")

    # Log next run time
    job = scheduler.get_job("daily_dataset_sync")
    if job:
        logger.info(f"📅 Next sync scheduled for: {job.next_run_time}")


def stop_scheduler():
    """Stop the background scheduler."""
    global scheduler

    if scheduler is not None:
        scheduler.shutdown()
        scheduler = None
        logger.info("🛑 Scheduler stopped")


def get_scheduler_status():
    """
    Get current scheduler status and job information.

    Returns:
        dict: Scheduler status with job details
    """
    if scheduler is None:
        return {
            "running": False,
            "jobs": []
        }

    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": str(job.next_run_time) if job.next_run_time else None,
            "trigger": str(job.trigger)
        })

    return {
        "running": scheduler.running,
        "jobs": jobs
    }


async def trigger_sync_now():
    """
    Manually trigger a dataset re-sync immediately.
    Useful for testing or manual updates.
    """
    logger.info("🚀 Manual sync triggered")
    await resync_all_datasets()
