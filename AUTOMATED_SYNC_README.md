# Automated Daily Dataset Sync

## Overview

NeuroVerse now features **automated daily dataset synchronization** that keeps your database up-to-date with the latest data from OpenNeuro **without any manual intervention**.

## How It Works

### Background Scheduler
- **Technology**: APScheduler (AsyncIO scheduler for Python)
- **Schedule**: Every day at **2:00 AM**
- **Process**: Re-syncs all datasets currently in the database
- **Automatic**: Starts when the backend starts, stops on shutdown

### What Gets Updated
1. **Participant Data**: Refreshes all participant records from OpenNeuro
2. **Dataset Metadata**: Updates titles, descriptions, and snapshot info
3. **Statistics**: Recalculates diagnosis, sex, and age distributions

## Setup

### 1. Install Dependencies

The scheduler requires `apscheduler` which is now in requirements.txt:

```bash
cd Backend
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start the Backend

The scheduler starts automatically when you run the backend:

```bash
uvicorn app.main:app --reload
```

You'll see:
```
🚀 Starting application...
🕐 Scheduler started - Daily sync at 2:00 AM
📅 Next sync scheduled for: 2025-10-26 02:00:00
```

## Monitoring

### Check Scheduler Status

**Via API:**
```bash
curl http://localhost:8000/api/v1/sync/scheduler/status
```

**Response:**
```json
{
  "running": true,
  "jobs": [
    {
      "id": "daily_dataset_sync",
      "name": "Daily Dataset Re-sync",
      "next_run": "2025-10-26 02:00:00",
      "trigger": "cron[hour='2', minute='0']"
    }
  ]
}
```

**Via API Documentation:**
Visit http://localhost:8000/docs and navigate to:
- `GET /api/v1/sync/scheduler/status`

### Backend Logs

The scheduler logs all sync operations:

```
🔄 Starting daily dataset re-sync...
📊 Found 5 datasets to re-sync
[1/5] Re-syncing ds000224...
✅ ds000224: 10 participants
[2/5] Re-syncing ds000001...
✅ ds000001: 16 participants
...
✨ Daily sync complete!
   ✅ Successful: 5
   ❌ Failed: 0
   ⏱️  Duration: 45.2s
```

## Manual Trigger

You can manually trigger a sync without waiting for 2:00 AM:

### Via API Call

```bash
curl -X POST http://localhost:8000/api/v1/sync/scheduler/trigger
```

### Via API Documentation

Visit http://localhost:8000/docs and use:
- `POST /api/v1/sync/scheduler/trigger`

### Via Python Script

```python
import asyncio
from app.services.scheduler_service import trigger_sync_now

asyncio.run(trigger_sync_now())
```

## Configuration

### Change Sync Time

Edit [app/services/scheduler_service.py](Backend/app/services/scheduler_service.py:61):

```python
# Currently set to 2:00 AM daily
scheduler.add_job(
    resync_all_datasets,
    trigger=CronTrigger(hour=2, minute=0),  # Change hour and minute here
    id="daily_dataset_sync",
    name="Daily Dataset Re-sync",
    replace_existing=True
)
```

**Examples:**
- `hour=0, minute=0` → Midnight
- `hour=12, minute=30` → 12:30 PM
- `hour=3, minute=15` → 3:15 AM

### Change Frequency

**Hourly Updates:**
```python
scheduler.add_job(
    resync_all_datasets,
    trigger=CronTrigger(minute=0),  # Every hour at minute 0
    id="hourly_dataset_sync",
    name="Hourly Dataset Re-sync"
)
```

**Every 6 Hours:**
```python
scheduler.add_job(
    resync_all_datasets,
    trigger=CronTrigger(hour='*/6', minute=0),  # 0:00, 6:00, 12:00, 18:00
    id="six_hour_dataset_sync",
    name="6-Hour Dataset Re-sync"
)
```

**Weekly (Sundays at 3 AM):**
```python
scheduler.add_job(
    resync_all_datasets,
    trigger=CronTrigger(day_of_week='sun', hour=3, minute=0),
    id="weekly_dataset_sync",
    name="Weekly Dataset Re-sync"
)
```

## Benefits

### For Users
- ✅ **Always Fresh Data**: Datasets automatically update without user action
- ✅ **No Downtime**: Syncs happen during low-traffic hours (2 AM)
- ✅ **Transparent**: Check status and logs anytime
- ✅ **Manual Control**: Trigger updates on-demand if needed

### For Developers
- ✅ **Background Processing**: No blocking of API requests
- ✅ **Async Operations**: Efficient resource usage
- ✅ **Error Handling**: Failed syncs don't crash the scheduler
- ✅ **Logging**: Detailed logs for monitoring and debugging

## Troubleshooting

### Scheduler Not Starting

**Problem**: No scheduler logs on startup

**Solution**:
1. Check if `apscheduler` is installed: `pip list | grep apscheduler`
2. Verify imports in [app/main.py](Backend/app/main.py)
3. Check for errors in startup logs

### Sync Failing

**Problem**: All datasets fail to sync

**Solution**:
1. Check internet connection
2. Verify OpenNeuro API is accessible: https://openneuro.org/crn/graphql
3. Check backend logs for specific errors
4. Test manual sync: `curl -X POST http://localhost:8000/api/v1/sync/scheduler/trigger`

### High Resource Usage

**Problem**: Sync consumes too much memory/CPU

**Solution**:
1. Reduce number of datasets in database
2. Change sync frequency (less often)
3. Increase server resources
4. Consider upgrading to PostgreSQL for better performance

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Backend                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Lifespan Manager                      │    │
│  │  • Starts scheduler on app startup              │    │
│  │  • Stops scheduler on app shutdown              │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │                                     │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │         APScheduler (AsyncIO)                   │    │
│  │  • Cron job: Daily at 2:00 AM                  │    │
│  │  • Job ID: "daily_dataset_sync"                │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │                                     │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │      resync_all_datasets() function             │    │
│  │  1. Query all datasets from database            │    │
│  │  2. For each dataset:                           │    │
│  │     • Fetch from OpenNeuro GraphQL API          │    │
│  │     • Download participants.tsv                 │    │
│  │     • Parse with Pandas                         │    │
│  │     • Update database                           │    │
│  │  3. Log results                                 │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │                                     │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │           SQLite Database                       │    │
│  │  • datasets table updated                       │    │
│  │  • participants table refreshed                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## API Endpoints

### GET /api/v1/sync/scheduler/status
Returns scheduler status and next run time.

**Response:**
```json
{
  "running": true,
  "jobs": [
    {
      "id": "daily_dataset_sync",
      "name": "Daily Dataset Re-sync",
      "next_run": "2025-10-26 02:00:00",
      "trigger": "cron[hour='2', minute='0']"
    }
  ]
}
```

### POST /api/v1/sync/scheduler/trigger
Manually triggers immediate sync of all datasets.

**Response:**
```json
{
  "status": "success",
  "message": "Manual sync completed successfully"
}
```

## Files Modified/Created

### Created:
- [Backend/app/services/scheduler_service.py](Backend/app/services/scheduler_service.py) - Scheduler implementation
- [Backend/app/data/curated_datasets.py](Backend/app/data/curated_datasets.py) - List of curated datasets
- [Backend/scripts/init_database.py](Backend/scripts/init_database.py) - Database initialization script

### Modified:
- [Backend/requirements.txt](Backend/requirements.txt) - Added `apscheduler==3.10.4`
- [Backend/app/main.py](Backend/app/main.py) - Added lifespan manager for scheduler
- [Backend/app/routers/sync.py](Backend/app/routers/sync.py) - Added scheduler endpoints
- [Frontend/neuro-frontend-main/src/services/api.js](Frontend/neuro-frontend-main/src/services/api.js) - Added scheduler API calls

## Summary

Your NeuroVerse application now has:

✅ **Automated daily updates** at 2:00 AM
✅ **Manual trigger** for on-demand syncs
✅ **Status monitoring** via API
✅ **Detailed logging** for transparency
✅ **Error handling** for reliability
✅ **Easy configuration** for custom schedules

**No more manual syncing required!** 🎉
