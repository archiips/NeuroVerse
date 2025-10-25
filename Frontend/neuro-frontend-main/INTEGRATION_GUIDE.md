# Frontend-Backend Integration Guide

## Overview
This guide explains how the NeuroVerse frontend integrates with the FastAPI backend to visualize neuroscience datasets from OpenNeuro.

## New Components Created

### 1. API Service (`src/services/api.js`)
Complete API client for communicating with the backend.

**Features:**
- Axios interceptors for auth and error handling
- Dataset endpoints (GET datasets, GET stats)
- Sync endpoints (POST sync dataset)
- Health check endpoint

**Usage:**
```javascript
import { datasetAPI, syncAPI } from '../services/api';

// Get all datasets
const response = await datasetAPI.getAllDatasets();

// Sync a new dataset
const result = await syncAPI.syncDataset('ds000224');
```

### 2. DatasetSync Component (`src/components/DatasetSync.jsx`)
UI for syncing new datasets from OpenNeuro.

**Features:**
- Input for OpenNeuro dataset ID
- Optional snapshot version
- Loading states and error handling
- Success notifications
- Example datasets to try

**Props:**
- `onSyncComplete(result)` - Callback when sync succeeds

### 3. DatasetsPageNew Component (`src/components/DatasetsPageNew.jsx`)
Updated datasets page that fetches from backend.

**Features:**
- Fetches real datasets from FastAPI
- Shows sync status badges
- Displays participant count
- Toggle sync panel
- Empty state with call-to-action
- Error handling with retry

### 4. VisualizationPage Component (`src/components/VisualizationPage.jsx`)
Interactive data visualization dashboard.

**Features:**
- Fetches dataset statistics from backend
- Three chart types: Bar, Pie, Histogram
- Tabbed interface (Summary, Diagnosis, Sex, Age)
- Data tables with percentages
- Responsive design

## Setup Instructions

### 1. Install Dependencies

First, make sure you have Chart.js installed:

```bash
cd Frontend/neuro-frontend-main
npm install chart.js react-chartjs-2
```

### 2. Configure Environment

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Update App Routing

Update your `App.jsx` or routing file to include the new components:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatasetsPageNew from './components/DatasetsPageNew';
import VisualizationPage from './components/VisualizationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... other routes ... */}
        <Route path="/datasets" element={<DatasetsPageNew />} />
        <Route path="/datasets/:id" element={<VisualizationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. Start Both Backend and Frontend

**Terminal 1 - Backend:**
```bash
cd Backend
./start.sh
```

**Terminal 2 - Frontend:**
```bash
cd Frontend/neuro-frontend-main
npm run dev
```

## Workflow

### First Time Setup

1. **Start Backend** (http://localhost:8000)
2. **Start Frontend** (http://localhost:5173)
3. **Navigate to Datasets Page**
4. **Click "Sync New Dataset"**
5. **Enter Dataset ID** (e.g., `ds000224`)
6. **Click "Sync Dataset"**
7. **Wait for sync to complete** (~10-30 seconds depending on dataset size)
8. **Click on the synced dataset card**
9. **View visualizations!**

### Syncing Your First Dataset

Recommended datasets for testing:

| Dataset ID | Name | Participants | Description |
|------------|------|--------------|-------------|
| `ds000224` | Midnight Scan Club | ~10 | Highly sampled individuals (best for testing) |
| `ds000001` | Single Task fMRI | ~16 | Classic example dataset |
| `ds000102` | Flanker Task | ~26 | Simple cognitive task |

## API Endpoints Used

### Backend Endpoints

```
GET  /api/v1/datasets                           # List all datasets
GET  /api/v1/datasets/{id}                      # Get dataset details
GET  /api/v1/datasets/{id}/stats/summary        # Get all statistics
GET  /api/v1/datasets/{id}/stats/diagnosis      # Get diagnosis distribution
GET  /api/v1/datasets/{id}/stats/sex            # Get sex distribution
GET  /api/v1/datasets/{id}/stats/age-distribution # Get age bins
POST /api/v1/sync/dataset                       # Sync from OpenNeuro
```

### Request/Response Examples

**Sync Dataset:**
```javascript
POST /api/v1/sync/dataset
{
  "openneuro_id": "ds000224",
  "snapshot_tag": "1.0.1"  // optional
}

Response:
{
  "status": "success",
  "dataset_id": 1,
  "openneuro_id": "ds000224",
  "participants_synced": 10
}
```

**Get Summary Statistics:**
```javascript
GET /api/v1/datasets/1/stats/summary

Response:
{
  "total_subjects": 10,
  "diagnosis": [
    {"label": "Healthy", "count": 7},
    {"label": "AD", "count": 3}
  ],
  "sex": [
    {"label": "M", "count": 5},
    {"label": "F", "count": 5}
  ],
  "age_distribution": [
    {"bin": "18-25", "count": 2},
    {"bin": "26-35", "count": 5},
    ...
  ]
}
```

## Component Architecture

```
App
├── DatasetsPageNew
│   ├── DatasetSync (conditional)
│   └── Dataset Cards (from backend)
│       └── Click → Navigate to VisualizationPage
│
└── VisualizationPage
    ├── Fetch dataset + statistics
    ├── Tabs (Summary, Diagnosis, Sex, Age)
    └── Charts
        ├── Bar Chart (Diagnosis, Age)
        ├── Pie Chart (Sex)
        └── Data Tables
```

## Error Handling

### Backend Not Running
If backend is not running, you'll see:
```
"Failed to load datasets. Please make sure the backend is running."
```

**Solution:** Start the backend with `cd Backend && ./start.sh`

### Dataset Not Found
If you try to visualize a dataset that hasn't been synced:
```
404: Dataset not found
```

**Solution:** Sync the dataset first from the Datasets page

### Sync Failures
Common sync errors:
- **"participants.tsv not found"** - Dataset doesn't have participant metadata
- **Network errors** - Check internet connection / OpenNeuro availability
- **Invalid dataset ID** - Double-check the OpenNeuro dataset ID

## Customization

### Change API URL
Update `.env`:
```env
VITE_API_URL=https://your-production-backend.com/api/v1
```

### Customize Charts
Edit `VisualizationPage.jsx`, modify the `chartOptions` object:

```javascript
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',  // Change legend position
    },
    title: {
      display: true,
      text: 'Custom Chart Title'
    }
  }
};
```

### Add New Statistics
1. Add backend endpoint in `app/routers/datasets.py`
2. Add service method in `app/services/statistics_service.py`
3. Add frontend API call in `src/services/api.js`
4. Update `VisualizationPage.jsx` to display new data

## Testing

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Datasets page loads (empty state shown if no datasets)
- [ ] Sync form appears when clicking "+ Sync New Dataset"
- [ ] Can sync dataset ds000224
- [ ] Dataset card appears after sync
- [ ] Clicking dataset card navigates to visualization page
- [ ] All 3 chart types render correctly
- [ ] Tab switching works
- [ ] Data tables show correct percentages
- [ ] Back button returns to datasets page

### Quick Test Script

```bash
# Terminal 1: Start backend
cd Backend
./start.sh

# Terminal 2: Start frontend
cd Frontend/neuro-frontend-main
npm run dev

# Terminal 3: Sync test dataset via curl
curl -X POST "http://localhost:8000/api/v1/sync/dataset" \
  -H "Content-Type: application/json" \
  -d '{"openneuro_id": "ds000224"}'

# Visit http://localhost:5173/datasets in browser
# Click on synced dataset to view visualizations
```

## Troubleshooting

### CORS Errors
Make sure backend `app/config.py` includes your frontend URL:
```python
cors_origins: List[str] = ["http://localhost:5173", ...]
```

### Chart Not Rendering
1. Check browser console for errors
2. Verify Chart.js is installed: `npm list chart.js`
3. Check that statistics data has correct format

### Slow Syncing
- Normal for large datasets (can take 30-60 seconds)
- Check backend logs for progress
- Verify internet connection

## Next Steps

1. **Add Authentication**: Implement user login/signup
2. **Dataset Search**: Add search/filter functionality
3. **Export Data**: Add CSV/PNG export for charts
4. **Dataset Comparison**: Compare multiple datasets side-by-side
5. **Advanced Filters**: Filter participants by age, sex, diagnosis
6. **Real-time Sync**: WebSocket updates for sync progress

## Resources

- **Backend API Docs**: http://localhost:8000/docs
- **OpenNeuro**: https://openneuro.org
- **Chart.js Docs**: https://www.chartjs.org/docs/latest/
- **React Router**: https://reactrouter.com/en/main
