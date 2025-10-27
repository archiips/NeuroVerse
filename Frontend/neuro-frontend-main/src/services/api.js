/**
 * API service for NeuroVerse backend
 * Handles all HTTP requests to the FastAPI backend
 */

import axios from 'axios';

// Base URL for the API - update this based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for sync operations
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Dataset API endpoints
 */
export const datasetAPI = {
  /**
   * Get all datasets
   */
  getAllDatasets: () => api.get('/datasets'),

  /**
   * Get a specific dataset by ID
   */
  getDatasetById: (id) => api.get(`/datasets/${id}`),

  /**
   * Get complete summary statistics for a dataset (OpenNeuro parser)
   */
  getSummaryStats: (dataset_id) => api.get(`/datasets/${dataset_id}/summary-stats`),

  /**
   * Get all participants for a dataset
   */
  getParticipants: (id) => api.get(`/datasets/${id}/participants`),
};

/**
 * Sync API endpoints
 */
export const syncAPI = {
  /**
   * Sync a dataset from OpenNeuro
   * @param {string} openneuroId - OpenNeuro dataset ID (e.g., "ds000224")
   * @param {string} snapshotTag - Optional snapshot version (e.g., "1.0.1")
   */
  syncDataset: (openneuroId, snapshotTag = null) => {
    const data = { openneuro_id: openneuroId };
    if (snapshotTag) {
      data.snapshot_tag = snapshotTag;
    }
    return api.post('/sync/dataset', data);
  },

  /**
   * Sync curated datasets from OpenNeuro
   * @param {number} limit - Number of datasets to sync (default: 10)
   */
  syncCuratedDatasets: (limit = 10) => {
    return api.post(`/sync/curated-datasets?limit=${limit}`);
  },

  /**
   * Get list of curated datasets
   */
  getCuratedList: () => api.get('/sync/curated-list'),
};

/**
 * Health check endpoint
 */
export const healthAPI = {
  checkHealth: () => axios.get('http://localhost:8000/health'),
};

export default api;
