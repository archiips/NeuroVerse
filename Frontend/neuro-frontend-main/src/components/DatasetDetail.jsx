import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { datasetAPI } from "../services/api";

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    fetchDatasetDetails();
  }, [id]);

  const fetchDatasetDetails = async () => {
    setLoading(true);
    try {
      const response = await datasetAPI.getDatasetById(id);
      const datasetData = response.data;
      
      console.log('📦 Dataset data received:', datasetData);
      console.log('📝 Description:', datasetData.description);

      setDataset({
        title: datasetData.name || datasetData.openneuro_id,
        name: datasetData.name || datasetData.openneuro_id,
        openneuro_id: datasetData.openneuro_id,
        participant_count: datasetData.participant_count || 0,
        modality: datasetData.modality || "fMRI",
        description: datasetData.description || "No description available",
      });
    } catch (error) {
      console.error("Error fetching dataset details:", error);
      setDataset({
        title: "Dataset",
        name: "Unknown Dataset",
        openneuro_id: null,
        participant_count: 0,
        description: "No description available"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToVisualization = () => {
    if (dataset?.openneuro_id) {
      setNavigating(true);
      // Small delay to show feedback before navigation
      setTimeout(() => {
        navigate(`/visualization/${dataset.openneuro_id}`);
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="p-4">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="text-white">Dataset not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-full sm:min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-2xl sm:text-[32px] font-bold leading-tight break-words">
              {dataset.name}
            </p>
            <p className="text-[#9dabb9] text-sm font-normal leading-normal break-words">
              NDA Data Structure
            </p>
            {/* Dataset Summary Box */}
            <div className="bg-[#1c2127] border border-[#3b4754] rounded-lg p-4 mt-2">
              <p className="text-white text-sm font-medium mb-1">Dataset Summary</p>
              <p className="text-[#9dabb9] text-sm leading-relaxed">
                {dataset.description}
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Info Cards */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-6">
              <p className="text-[#9dabb9] text-sm mb-2">Participants</p>
              <p className="text-white text-3xl font-bold">
                {dataset.participant_count}
              </p>
            </div>
            <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-6">
              <p className="text-[#9dabb9] text-sm mb-2">Modality</p>
              <p className="text-white text-xl font-medium">
                {dataset.modality}
              </p>
            </div>
            <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-6">
              <p className="text-[#9dabb9] text-sm mb-2">Dataset ID</p>
              <p className="text-white text-xl font-mono">
                {dataset.openneuro_id}
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-6 md:p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-primary-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-white text-lg font-medium mb-2">
              Participant Demographics Available
            </p>
            <p className="text-[#9dabb9] text-sm mb-4">
              Detailed demographic information including age, sex, and diagnosis
              distributions are available in the visualization dashboard.
            </p>
            <button
              onClick={handleNavigateToVisualization}
              disabled={!dataset?.openneuro_id || navigating}
              className={`inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataset?.openneuro_id && !navigating
                  ? "bg-primary-blue text-white hover:bg-secondary-blue"
                  : "bg-[#3b4754] text-[#9dabb9] cursor-not-allowed"
              }`}
            >
              {navigating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Visualization Dashboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
