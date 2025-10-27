# NeuroVerse - Neuroscience Data Exploration Platform

NeuroVerse is a full-stack web application for exploring and visualizing real participant demographics from OpenNeuro datasets.
Built with **FastAPI**, **React**, **SQLite**, and **Plotly.js**.

---

## Quick Start

### Backend Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: [http://localhost:8000](http://localhost:8000)

### Frontend Setup

```bash
cd Frontend/neuro-frontend-main
npm install
npm run dev
```

Frontend runs at: [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
Backend/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/dataset.py
│   ├── routers/datasets.py
│   └── services/openneuro_service.py
├── neuroverse.db
└── requirements.txt

Frontend/
└── neuro-frontend-main/
    ├── src/
    │   ├── components/
    │   │   ├── DatasetsPage.jsx
    │   │   ├── DataVisualization.jsx
    │   │   └── charts/
    │   └── services/api.js
    └── package.json
```

---

## API Endpoints

| Method | Endpoint                                        | Description                                     |
| ------ | ----------------------------------------------- | ----------------------------------------------- |
| GET    | `/api/v1/datasets`                              | List all datasets (sorted by participant count) |
| GET    | `/api/v1/datasets/{id}`                         | Get dataset details                             |
| GET    | `/api/v1/datasets/{openneuro_id}/summary-stats` | Get demographics summary                        |

**Example Response**

```json
{
  "success": true,
  "data": {
    "total_participants": 31,
    "confidence": "high",
    "available_stats": ["sex", "age"],
    "age_stats": { "mean": 22.4, "min": 18.0, "max": 35.0 },
    "sex": [
      { "label": "Female", "count": 16, "percentage": "51.6" },
      { "label": "Male", "count": 15, "percentage": "48.4" }
    ]
  }
}
```

---

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, Pandas, SQLite
**Frontend:** React, React Router v6, Plotly.js, Tailwind CSS, Axios

---

## Dataset Summary

- Total Datasets: 23 (verified)
- Total Participants: ~2,700
- Largest Studies: ds003097 (928), ds002785 (216), ds004199 (170)

---

## License and Data Source

- License: MIT
- Data: [OpenNeuro.org](https://openneuro.org) (CC0 Public Domain)

---

**Developer:** Archit Jaiswal
**Email:** [architjaiswal18@gmail.com](mailto:architjaiswal18@gmail.com)

---
