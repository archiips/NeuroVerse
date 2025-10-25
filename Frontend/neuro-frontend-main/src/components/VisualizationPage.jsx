/**
 * VisualizationPage Component
 * Displays interactive charts and statistics for a dataset
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { datasetAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VisualizationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetchDatasetAndStats();
  }, [id]);

  const fetchDatasetAndStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch dataset details and statistics in parallel
      const [datasetResponse, statsResponse] = await Promise.all([
        datasetAPI.getDatasetById(id),
        datasetAPI.getSummaryStats(id)
      ]);

      setDataset(datasetResponse.data);
      setStatistics(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dataset statistics');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const diagnosisChartData = statistics ? {
    labels: statistics.diagnosis.map(item => item.label),
    datasets: [{
      label: 'Number of Subjects',
      data: statistics.diagnosis.map(item => item.count),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
    }]
  } : null;

  const sexChartData = statistics ? {
    labels: statistics.sex.map(item => item.label),
    datasets: [{
      label: 'Number of Subjects',
      data: statistics.sex.map(item => item.count),
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 2,
    }]
  } : null;

  const ageChartData = statistics ? {
    labels: statistics.age_distribution.map(item => item.bin),
    datasets: [{
      label: 'Number of Subjects',
      data: statistics.age_distribution.map(item => item.count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visualizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate('/datasets')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/datasets')}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Datasets
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset?.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <span className="material-symbols-outlined text-base mr-1">dataset</span>
            {dataset?.openneuro_id}
          </span>
          <span className="flex items-center">
            <span className="material-symbols-outlined text-base mr-1">group</span>
            {statistics?.total_subjects} participants
          </span>
          {dataset?.snapshot_tag && (
            <span className="flex items-center">
              <span className="material-symbols-outlined text-base mr-1">label</span>
              v{dataset.snapshot_tag}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['summary', 'diagnosis', 'sex', 'age'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'summary' ? 'Statistics' : 'Distribution'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary View */}
        {activeTab === 'summary' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Diagnosis Distribution</h3>
              <div className="h-80">
                {diagnosisChartData && <Bar data={diagnosisChartData} options={chartOptions} />}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sex Distribution</h3>
              <div className="h-80">
                {sexChartData && <Pie data={sexChartData} options={chartOptions} />}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
              <div className="h-80">
                {ageChartData && <Bar data={ageChartData} options={chartOptions} />}
              </div>
            </div>
          </>
        )}

        {/* Diagnosis Tab */}
        {activeTab === 'diagnosis' && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Diagnosis Distribution</h3>
            <div className="h-96">
              {diagnosisChartData && <Bar data={diagnosisChartData} options={chartOptions} />}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Data Table</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Diagnosis</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics?.diagnosis.map((item, idx) => {
                    const percentage = ((item.count / statistics.total_subjects) * 100).toFixed(1);
                    return (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.label}</td>
                        <td className="text-right py-2">{item.count}</td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sex Tab */}
        {activeTab === 'sex' && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Sex Distribution</h3>
            <div className="h-96">
              {sexChartData && <Pie data={sexChartData} options={chartOptions} />}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Data Table</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Sex</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics?.sex.map((item, idx) => {
                    const percentage = ((item.count / statistics.total_subjects) * 100).toFixed(1);
                    return (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.label}</td>
                        <td className="text-right py-2">{item.count}</td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Age Tab */}
        {activeTab === 'age' && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
            <div className="h-96">
              {ageChartData && <Bar data={ageChartData} options={chartOptions} />}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Data Table</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Age Range</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics?.age_distribution.map((item, idx) => {
                    const percentage = ((item.count / statistics.total_subjects) * 100).toFixed(1);
                    return (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.bin}</td>
                        <td className="text-right py-2">{item.count}</td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPage;
