# NeuroVerse Backend API

FastAPI backend for the NeuroVerse neuroscience data visualization platform. This backend integrates with OpenNeuro's GraphQL API to fetch and visualize dataset metadata.

## Features

- 🔄 **OpenNeuro Integration**: Sync datasets directly from OpenNeuro using GraphQL API
- 📊 **Statistical Aggregations**: Fast local queries for diagnosis, sex, and age distributions
- 💾 **Local Caching**: SQLite database for quick access to synced datasets
- 📝 **Auto-generated Docs**: Interactive API documentation with Swagger UI
- 🚀 **Async Support**: Asynchronous operations for improved performance

## Project Structure

```
Backend/
├── app/
│   ├── main.py                    # FastAPI application
│   ├── config.py                  # Configuration settings
│   ├── models/                    # SQLAlchemy database models
│   │   ├── dataset.py
│   │   ├── participant.py
│   │   └── sync_log.py
│   ├── schemas/                   # Pydantic request/response models
│   │   ├── dataset.py
│   │   ├── participant.py
│   │   └── statistics.py
│   ├── services/                  # Business logic
│   │   ├── openneuro_service.py   # GraphQL client
│   │   ├── data_sync_service.py   # Dataset synchronization
│   │   └── statistics_service.py  # Statistical calculations
│   ├── routers/                   # API endpoints
│   │   ├── datasets.py
│   │   └── sync.py
│   └── database/
│       └── connection.py          # Database session management
├── data/                          # Cache directory
├── requirements.txt
└── README.md
```

## Installation

### Prerequisites

- Python 3.9+
- pip or poetry

### Setup

1. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

## Running the Application

### Development Server

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Usage

### 1. Sync a Dataset from OpenNeuro

**Endpoint**: `POST /api/v1/sync/dataset`

**Request Body**:
```json
{
  "openneuro_id": "ds000224",
  "snapshot_tag": "1.0.1"
}
```

**Response**:
```json
{
  "status": "success",
  "dataset_id": 1,
  "openneuro_id": "ds000224",
  "participants_synced": 10
}
```

**Example with curl**:
```bash
curl -X POST "http://localhost:8000/api/v1/sync/dataset" \
  -H "Content-Type: application/json" \
  -d '{"openneuro_id": "ds000224"}'
```

### 2. Get All Datasets

**Endpoint**: `GET /api/v1/datasets`

**Response**:
```json
[
  {
    "id": 1,
    "openneuro_id": "ds000224",
    "name": "The Midnight Scan Club (MSC) dataset",
    "is_synced": true,
    "participant_count": 10,
    ...
  }
]
```

### 3. Get Dataset Statistics

**Endpoint**: `GET /api/v1/datasets/{dataset_id}/stats/summary`

**Response**:
```json
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

## Database Schema

### Dataset Table
Stores metadata about OpenNeuro datasets.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| openneuro_id | String(50) | OpenNeuro dataset ID (e.g., "ds000224") |
| name | String(500) | Dataset name |
| snapshot_tag | String(50) | Version tag (e.g., "1.0.1") |
| is_synced | Boolean | Sync status |
| participant_count | Integer | Number of participants |

### Participant Table
Stores individual participant metadata from participants.tsv files.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| dataset_id | Integer | Foreign key to datasets |
| participant_id | String(100) | Subject identifier (e.g., "sub-01") |
| age | Float | Age in years |
| sex | String(10) | Sex (M/F/Other) |
| diagnosis | String(200) | Clinical diagnosis |

## Example Datasets to Try

| OpenNeuro ID | Name | Description |
|--------------|------|-------------|
| ds000224 | Midnight Scan Club | Highly sampled individuals (recommended for testing) |
| ds000001 | Single Task fMRI | Classic example dataset |
| ds000102 | Flanker Task | Simple cognitive task dataset |

## Development

### Running Tests

```bash
pytest
```

### Code Structure

- **Models**: SQLAlchemy ORM models for database tables
- **Schemas**: Pydantic models for request/response validation
- **Services**: Business logic layer (OpenNeuro API, sync, statistics)
- **Routers**: API endpoint definitions

## Troubleshooting

### Database Issues

If you encounter database issues, delete the database file and restart:
```bash
rm neuroverse.db
uvicorn app.main:app --reload
```

### OpenNeuro Connection Issues

- Verify internet connection
- Check if OpenNeuro API is accessible: https://openneuro.org/crn/graphql
- Some datasets may not have participants.tsv files

## License

MIT

## Contributors

Built for the NeuroVerse visualization platform.
