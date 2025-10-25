/**
 * DatasetsPage Component - Connected to Backend
 * Displays datasets synced from OpenNeuro with ability to sync new ones
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { datasetAPI } from '../services/api';
import DatasetSync from './DatasetSync';

const DatasetsPageNew = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSync, setShowSync] = useState(false);

  // Fetch datasets on component mount
  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await datasetAPI.getAllDatasets();
      setDatasets(response.data);
    } catch (err) {
      setError('Failed to load datasets. Please make sure the backend is running.');
      console.error('Error fetching datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncComplete = (result) => {
    // Refresh dataset list after successful sync
    fetchDatasets();
    setShowSync(false);
  };

  // Loading state
  if (loading && datasets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading datasets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-6">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Available Datasets
        </h2>
        <button
          onClick={() => setShowSync(!showSync)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          {showSync ? 'Hide Sync' : '+ Sync New Dataset'}
        </button>
      </div>

      {/* Dataset Sync Component */}
      {showSync && (
        <DatasetSync onSyncComplete={handleSyncComplete} />
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-start">
            <span className="material-symbols-outlined mr-2">error</span>
            <div>
              <p className="font-semibold">Error loading datasets</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchDatasets}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && datasets.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              dataset
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No datasets found</h3>
          <p className="text-gray-600 mb-4">
            Get started by syncing your first dataset from OpenNeuro
          </p>
          <button
            onClick={() => setShowSync(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Sync Your First Dataset
          </button>
        </div>
      )}

      {/* Dataset Grid */}
      {datasets.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {datasets.map((dataset) => (
            <Link
              key={dataset.id}
              to={`/datasets/${dataset.id}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm transition-all hover:shadow-lg dark:border-dark-border/80 dark:bg-dark-border/30 dark:hover:border-secondary-blue/50 cursor-pointer"
            >
              {/* Dataset Header */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-3xl">dataset</span>
                  {dataset.is_synced ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Synced
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg line-clamp-2">{dataset.name}</h3>
                <p className="text-sm opacity-90 mt-1">{dataset.openneuro_id}</p>
              </div>

              {/* Dataset Info */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-base mr-2">group</span>
                    <span>{dataset.participant_count || 0} participants</span>
                  </div>
                  {dataset.snapshot_tag && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-2">label</span>
                      <span>v{dataset.snapshot_tag}</span>
                    </div>
                  )}
                  {dataset.last_synced_at && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-base mr-2">schedule</span>
                      <span>
                        Synced {new Date(dataset.last_synced_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary-blue hover:underline dark:text-light-blue">
                  View Visualizations
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasetsPageNew;
