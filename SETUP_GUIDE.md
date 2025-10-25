# NeuroVerse Setup Guide

## Quick Start - Pre-load Datasets

Follow these steps to get your application running with pre-loaded datasets:

### Step 1: Install Backend Dependencies

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Initialize Database with Curated Datasets

This will pre-load popular OpenNeuro datasets so users can browse immediately:

```bash
# Sync 5 curated datasets (recommended for testing - ~5-10 minutes)
python scripts/init_database.py --limit 5

# Or sync all 10 curated datasets (~10-20 minutes)
python scripts/init_database.py --limit 10
```

**Curated Datasets Include:**
1. ds000224 - Midnight Scan Club (high-quality resting state fMRI)
2. ds000001 - Single Subject Task fMRI
3. ds000102 - Flanker task (event-related fMRI)
4. ds000105 - Visual object recognition
5. ds000113 - Forrest Gump watching fMRI
6. ds000114 - Test-retest fMRI tasks
7. ds000117 - Multi-modal face processing
8. ds000228 - Pediatric brain development
9. ds000030 - UCLA Neuropsychiatric Phenomics
10. ds000171 - IXI Normal aging brain MRI

### Step 3: Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000
API Documentation: http://localhost:8000/docs

**🔄 Automated Daily Updates:**
The backend automatically re-syncs all datasets **every day at 2:00 AM** to keep data fresh from OpenNeuro. No manual intervention needed!

### Step 4: Install Frontend Dependencies

In a new terminal:

```bash
cd "Frontend/neuro-frontend-main"
npm install
```

### Step 5: Start Frontend Server

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

### Step 6: Browse Datasets

1. Open http://localhost:5173/datasets
2. You'll see all pre-loaded datasets immediately
3. Click any dataset to view interactive visualizations
4. No manual syncing required!

---

## Automated Daily Sync

**The backend automatically updates all datasets every day at 2:00 AM!**

### Check Scheduler Status

```bash
# See when the next sync is scheduled
curl "http://localhost:8000/api/v1/sync/scheduler/status"
```

Response:
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

### Manual Sync (On-Demand)

Trigger an immediate re-sync without waiting for the scheduled time:

```bash
# Trigger manual sync now
curl -X POST "http://localhost:8000/api/v1/sync/scheduler/trigger"
```

---

## Alternative: Sync Datasets via API

If you prefer to sync datasets programmatically or add more datasets later:

### Using the API Endpoint

```bash
# Sync curated datasets via API
curl -X POST "http://localhost:8000/api/v1/sync/curated-datasets?limit=5"

# Get list of available curated datasets
curl "http://localhost:8000/api/v1/sync/curated-list"

# Sync a specific dataset
curl -X POST "http://localhost:8000/api/v1/sync/dataset" \
  -H "Content-Type: application/json" \
  -d '{"openneuro_id": "ds000224", "snapshot_tag": "1.0.0"}'
```

### Using the Frontend UI

1. Navigate to http://localhost:5173/datasets
2. Click "+ Sync New Dataset"
3. Enter OpenNeuro ID (e.g., `ds000224`)
4. Click "Sync Dataset"
5. Wait for confirmation (~10-30 seconds per dataset)

---

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'pydantic_settings'`
**Solution**: Make sure you activated the virtual environment:
```bash
cd Backend
source venv/bin/activate
pip install -r requirements.txt
```

**Problem**: Pandas compilation error with Python 3.13
**Solution**: The requirements.txt has been updated to use pandas 2.2.3 which supports Python 3.13

**Problem**: Database not found
**Solution**: The database is auto-created on first startup. If you want to pre-populate it, run:
```bash
python scripts/init_database.py --limit 5
```

### Frontend Issues

**Problem**: "Failed to load datasets"
**Solution**:
1. Check backend is running at http://localhost:8000
2. Verify `.env` file exists with `VITE_API_URL=http://localhost:8000/api/v1`
3. Check browser console for CORS errors

**Problem**: Charts not rendering
**Solution**:
1. Make sure you ran `npm install` to get chart.js and react-chartjs-2
2. Verify dataset has data by checking the API: http://localhost:8000/api/v1/datasets

**Problem**: "No datasets found"
**Solution**: Run the initialization script to pre-load datasets:
```bash
cd Backend
python scripts/init_database.py --limit 5
```

### Sync Issues

**Problem**: Sync takes too long
**Solution**:
- Some datasets are large and may take 1-2 minutes to sync
- Start with smaller datasets like ds000224 (Midnight Scan Club)
- The init script syncs datasets sequentially - this is normal

**Problem**: "Failed to sync dataset"
**Solution**:
- Check your internet connection
- Verify the OpenNeuro ID is correct
- Some datasets may not have participants.tsv files
- Check backend logs for detailed error messages

---

## Database Location

The SQLite database is created at:
```
Backend/neuroscience.db
```

To reset the database:
```bash
cd Backend
rm neuroscience.db
python scripts/init_database.py --limit 5
```

---

## API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                 http://localhost:5173                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ React Frontend
                         │ (Vite + Chart.js)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend                             │
│                http://localhost:8000                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Routers   │  │   Services   │  │   Database       │   │
│  │  /datasets  │─▶│ SyncService  │─▶│  SQLite/Postgres │   │
│  │    /sync    │  │ StatsService │  │  (neuroscience   │   │
│  └─────────────┘  └──────┬───────┘  │      .db)        │   │
│                           │          └──────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│                  ┌────────────────┐                          │
│                  │ OpenNeuro API  │                          │
│                  │   (GraphQL)    │                          │
│                  └────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Tips

1. **Pre-load datasets**: Use the init script instead of manual syncing for better UX
2. **Start small**: Begin with 3-5 datasets, add more as needed
3. **Use SQLite for development**: Fast and simple, no setup required
4. **Upgrade to PostgreSQL for production**: Better for concurrent users

---

## Next Steps

After setup:
1. ✅ Explore pre-loaded datasets
2. ✅ View interactive visualizations
3. ✅ Test different chart types (bar, pie, histogram)
4. 📊 Add more datasets via the sync UI
5. 🎨 Customize the frontend styling
6. 🔐 Add authentication (future)
7. 🚀 Deploy to production

---

## Support

- **Backend API Docs**: http://localhost:8000/docs
- **Frontend Integration Guide**: [Frontend/neuro-frontend-main/FRONTEND_INTEGRATION_README.md](Frontend/neuro-frontend-main/FRONTEND_INTEGRATION_README.md)
- **Full Documentation**: [FRONTEND_BACKEND_INTEGRATION_COMPLETE.md](FRONTEND_BACKEND_INTEGRATION_COMPLETE.md)
