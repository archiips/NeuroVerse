"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Update imports
from app.database import engine, Base
from app.models.dataset import Base as DatasetBase
from app.routers import datasets

# Remove sync router since we don't need OpenNeuro sync anymore
# from app.routers import sync

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NeuroVerse API", version="1.0.0")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)
DatasetBase.metadata.create_all(bind=engine)

# Include routers
app.include_router(datasets.router)
# Remove sync router - we don't need it for NDA
# app.include_router(sync.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "NeuroVerse API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
