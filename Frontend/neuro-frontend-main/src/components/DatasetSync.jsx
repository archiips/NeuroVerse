/**
 * DatasetSync Component
 * Allows users to sync new datasets from OpenNeuro
 */

import React, { useState } from 'react';
import { syncAPI } from '../services/api';

const DatasetSync = ({ onSyncComplete }) => {
  const [openneuroId, setOpenneuroId] = useState('');
  const [snapshotTag, setSnapshotTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSync = async (e) => {
    e.preventDefault();

    if (!openneuroId.trim()) {
      setError('Please enter an OpenNeuro dataset ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await syncAPI.syncDataset(
        openneuroId.trim(),
        snapshotTag.trim() || null
      );

      const result = response.data;

      if (result.status === 'success') {
        setSuccess(`Successfully synced ${result.participants_synced} participants from ${result.openneuro_id}`);
        setOpenneuroId('');
        setSnapshotTag('');

        // Notify parent component to refresh dataset list
        if (onSyncComplete) {
          onSyncComplete(result);
        }
      } else {
        setError(result.message || 'Sync failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to sync dataset. Please check the dataset ID and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Sync New Dataset from OpenNeuro
      </h2>

      <form onSubmit={handleSync} className="space-y-4">
        <div>
          <label htmlFor="openneuroId" className="block text-sm font-medium text-gray-700 mb-1">
            OpenNeuro Dataset ID *
          </label>
          <input
            type="text"
            id="openneuroId"
            value={openneuroId}
            onChange={(e) => setOpenneuroId(e.target.value)}
            placeholder="e.g., ds000224"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the dataset ID from OpenNeuro (e.g., ds000224 for Midnight Scan Club)
          </p>
        </div>

        <div>
          <label htmlFor="snapshotTag" className="block text-sm font-medium text-gray-700 mb-1">
            Snapshot Version (Optional)
          </label>
          <input
            type="text"
            id="snapshotTag"
            value={snapshotTag}
            onChange={(e) => setSnapshotTag(e.target.value)}
            placeholder="e.g., 1.0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to sync the latest version
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p className="text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Syncing Dataset...
            </span>
          ) : (
            'Sync Dataset'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Example Datasets to Try:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <button
              onClick={() => setOpenneuroId('ds000224')}
              className="hover:underline text-left"
              type="button"
            >
              <strong>ds000224</strong> - Midnight Scan Club (recommended for testing)
            </button>
          </li>
          <li>
            <button
              onClick={() => setOpenneuroId('ds000001')}
              className="hover:underline text-left"
              type="button"
            >
              <strong>ds000001</strong> - Single Task fMRI
            </button>
          </li>
          <li>
            <button
              onClick={() => setOpenneuroId('ds000102')}
              className="hover:underline text-left"
              type="button"
            >
              <strong>ds000102</strong> - Flanker Task
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DatasetSync;
