import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { datasetAPI } from "../services/api";
import BarChart3D from "./charts/BarChart3D";
import DonutChart from "./charts/DonutChart";

// EmptyState component for missing data
const EmptyState = ({ icon: Icon, message, suggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-[#9dabb9]">
      {Icon && <Icon className="w-16 h-16 mb-4 opacity-30" />}
      {!Icon && (
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
      <p className="text-lg font-medium mb-2 text-white">{message}</p>
      {suggestion && (
        <p className="text-sm text-[#9dabb9]">{suggestion}</p>
      )}
    </div>
  );
};

const DataVisualization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [chartType, setChartType] = useState("3d");
  const [dataset, setDataset] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [sexData, setSexData] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    fetchDatasetAndStats();
  }, [id]);

  // Smart tab selection based on available stats
  useEffect(() => {
    if (summaryStats?.available_stats && summaryStats.available_stats.length > 0) {
      const firstAvailable = ['diagnosis', 'sex', 'age'].find(
        stat => summaryStats.available_stats.includes(stat)
      );
      if (firstAvailable && !summaryStats.available_stats.includes(activeTab)) {
        setActiveTab(firstAvailable);
      }
    }
  }, [summaryStats]);

  const fetchDatasetAndStats = async () => {
    try {
      setLoading(true);

      const datasetsResponse = await datasetAPI.getAllDatasets();
      let datasetRecord = datasetsResponse.data.find(ds => ds.openneuro_id === id);
      let resolvedOpenNeuroId = datasetRecord?.openneuro_id || id;

      if (!datasetRecord) {
        const numericId = Number(id);
        if (!Number.isNaN(numericId)) {
          try {
            const datasetByIdResponse = await datasetAPI.getDatasetById(numericId);
            datasetRecord = datasetByIdResponse.data;
            resolvedOpenNeuroId = datasetRecord?.openneuro_id || resolvedOpenNeuroId;
          } catch {
            datasetRecord = null;
          }
        }
      }

      if (!datasetRecord || !resolvedOpenNeuroId) {
        throw new Error(`Dataset ${id} not found`);
      }

      setDataset({
        name: datasetRecord.name || resolvedOpenNeuroId,
        description: datasetRecord.description || "This dataset includes recordings from participants performing various cognitive tasks.",
        participants: datasetRecord.participant_count || 0,
        tasks: datasetRecord.tasks || 5,
        modality: datasetRecord.modality || "fMRI",
        dataQuality: datasetRecord.dataQuality || datasetRecord.data_quality || "unknown",
        availableStats: datasetRecord.availableStats || datasetRecord.available_stats || []
      });

      try {
        console.log('🔍 Fetching stats for:', resolvedOpenNeuroId);
        const statsResponse = await datasetAPI.getSummaryStats(resolvedOpenNeuroId);
        console.log('📊 Stats response:', statsResponse);
        
        // Try different data access patterns
        let stats = statsResponse.data?.data || statsResponse.data;
        console.log('📊 Extracted stats:', stats);
        console.log('📊 Available stats array:', stats?.available_stats);
        console.log('📊 Diagnosis:', stats?.diagnosis);
        console.log('📊 Sex:', stats?.sex);
        console.log('📊 Age distribution:', stats?.age_distribution);
        
        // If stats is wrapped in success/data, unwrap it
        if (stats?.success && stats?.data) {
          stats = stats.data;
          console.log('📊 Unwrapped stats:', stats);
        }
        
        if (!stats || typeof stats !== "object") {
          throw new Error("Invalid stats response");
        }
        
        // Store raw stats with quality indicators
        setSummaryStats({
          total_participants: stats.total_participants || datasetRecord.participant_count || 0,
          confidence: stats.confidence || "unavailable",
          available_stats: stats.available_stats || [],
          age_stats: stats.age_stats,
          diagnosis: stats.diagnosis,
          sex: stats.sex,
          age_distribution: stats.age_distribution
        });

        const colors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

        // Process diagnosis data (conditional)
        if (stats.diagnosis && Array.isArray(stats.diagnosis) && stats.diagnosis.length > 0) {
          // Calculate total with diagnosis data
          const totalWithDiagnosis = stats.diagnosis.reduce((sum, item) => sum + item.count, 0);
          
          const diagnosisCategories = stats.diagnosis.map((item, idx) => ({
            name: item.label,
            count: item.count,
            percentage: parseFloat(item.percentage),
            color: colors[idx % colors.length]
          }));

          setDiagnosisData({
            totalSubjects: stats.total_participants,
            totalWithData: totalWithDiagnosis,
            averageAge: stats.age_stats?.mean || 0,
            categories: diagnosisCategories
          });
        } else {
          setDiagnosisData(null);
        }

        // Process sex data (conditional)
        if (stats.sex && Array.isArray(stats.sex) && stats.sex.length > 0) {
          // Calculate total with sex data
          const totalWithSex = stats.sex.reduce((sum, item) => sum + item.count, 0);
          
          const sexCategories = stats.sex.map((item, idx) => ({
            name: item.label,
            count: item.count,
            percentage: parseFloat(item.percentage),
            color: colors[idx % colors.length]
          }));

          setSexData({
            totalSubjects: stats.total_participants,
            totalWithData: totalWithSex,
            averageAge: stats.age_stats?.mean || 0,
            categories: sexCategories
          });
        } else {
          setSexData(null);
        }

        // Process age distribution data (conditional)
        if (stats.age_distribution && Array.isArray(stats.age_distribution) && stats.age_distribution.length > 0) {
          // Calculate total with age data
          const totalWithAge = stats.age_distribution.reduce((sum, item) => sum + item.count, 0);
          
          const ageCategories = stats.age_distribution.map((item, idx) => ({
            name: item.bin,
            count: item.count,
            percentage: stats.total_participants > 0 ? parseFloat(((item.count / stats.total_participants) * 100).toFixed(1)) : 0,
            color: colors[idx % colors.length]
          }));

          setAgeData({
            totalSubjects: stats.total_participants,
            totalWithData: totalWithAge,
            averageAge: stats.age_stats?.mean || 0,
            categories: ageCategories,
            ageStats: stats.age_stats
          });
        } else {
          setAgeData(null);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Set all data to null - no mock fallbacks
        setSummaryStats({
          total_participants: datasetRecord.participant_count || 0,
          confidence: "unavailable",
          available_stats: []
        });
        setDiagnosisData(null);
        setSexData(null);
        setAgeData(null);
      }
    } catch (error) {
      console.error("Error fetching dataset:", error);
      setDataset(null);
      setSummaryStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "sex":
        return sexData;
      case "age":
        return ageData;
      default:
        return diagnosisData;
    }
  };

  const getCurrentTitle = () => {
    switch (activeTab) {
      case "sex":
        return "Sex Distribution";
      case "age":
        return "Age Distribution";
      default:
        return "Diagnosis Distribution";
    }
  };

  const currentData = getCurrentData();

  // Check if any visualization data is available
  const hasAnyVisualizationData = diagnosisData || sexData || ageData;
  
  // Check if current data has missing participants
  const hasMissingData = currentData && currentData.totalWithData < currentData.totalSubjects;
  const missingCount = currentData ? currentData.totalSubjects - currentData.totalWithData : 0;
  const dataCompleteness = currentData && currentData.totalSubjects > 0 
    ? ((currentData.totalWithData / currentData.totalSubjects) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-eerie-black">
        <div className="text-center">
          {/* Simple spinner */}
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if dataset fetch failed
  if (!dataset) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-eerie-black">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Unable to load dataset</div>
          <button
            onClick={() => navigate('/datasets')}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors mx-auto"
          >
            <span className="truncate">Back to Datasets</span>
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no visualization data available
  if (!hasAnyVisualizationData) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-eerie-black">
        <div className="text-center max-w-2xl px-4">
          <svg className="w-20 h-20 mx-auto mb-6 text-[#9dabb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-white text-2xl font-bold mb-4">No Participant Demographics Available</div>
          <p className="text-[#9dabb9] mb-4 leading-relaxed">
            This <span className="text-white font-medium">OpenNeuro dataset</span> does not have a participants.tsv file with demographic information.
          </p>
          <div className="bg-[#1c2127] border border-[#3b4754] rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-[#9dabb9] mb-3">
              <span className="text-white font-medium">Why is this happening?</span>
            </p>
            <ul className="text-sm text-[#9dabb9] space-y-2">
              <li>• This dataset may only contain imaging files without participant metadata</li>
              <li>• Some older datasets were uploaded without demographic information</li>
              <li>• Try viewing other datasets like <span className="text-white font-medium">ds000030</span> (UCLA Consortium) which has complete demographics</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/datasets', { replace: true })}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors mx-auto"
          >
            <span className="truncate">Back to Datasets</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      {/* Left Sidebar - Dataset Summary */}
      <aside className="w-full lg:w-80 bg-dark-border p-6 flex flex-col shadow-lg">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <svg className="w-10 h-10 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">NeuroVerse</h1>
          </div>

          <h2 className="text-lg font-semibold mb-3 text-white">About This Dataset</h2>

          {/* Dataset Name & Description */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-[#9dabb9] mb-1">Dataset Name</p>
              <p className="font-medium text-white break-words">{dataset.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-[#9dabb9] mb-1">Description</p>
              <p className="text-sm text-white leading-relaxed break-words">
                {dataset.description}
              </p>
            </div>
          </div>

          <div className="border-t border-[#3b4754] pt-4 space-y-4">
            <h3 className="text-md font-semibold text-white">Quick Stats</h3>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Participants</p>
              <p className="font-semibold text-lg text-white">{dataset.participants}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Modality</p>
              <p className="font-medium text-sm bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">
                {dataset.modality}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Dataset ID</p>
              <p className="font-mono text-xs text-white break-all">{id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-eerie-black">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-3 mb-8">
          <div className="flex min-w-full sm:min-w-72 flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Visualization Dashboard</h1>
            <p className="text-[#9dabb9] text-base md:text-lg">Explore real participant demographics through interactive charts.</p>
          </div>
          <button
            onClick={() => navigate('/datasets', { replace: true })}
            className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors"
          >
            <span className="truncate">Back to Datasets</span>
          </button>
        </div>

        {/* Data Quality Alert */}
        {summaryStats?.confidence !== "high" && summaryStats?.confidence !== "unavailable" && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-yellow-300 font-medium">Partial Data Available</p>
              <p className="text-xs text-yellow-400/80 mt-1">
                {summaryStats.confidence === "estimated" 
                  ? `Demographic data available for ${summaryStats.total_participants} participants. Some fields may be incomplete or estimated.`
                  : "Limited demographic data available for this dataset."}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 border-b border-[#3b4754] mb-6">
          <button
            onClick={() => setActiveTab("diagnosis")}
            disabled={!diagnosisData}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "diagnosis"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            } ${!diagnosisData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Diagnosis Distribution
            {!diagnosisData && (
              <span className="ml-2 text-xs">(Unavailable)</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sex")}
            disabled={!sexData}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "sex"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            } ${!sexData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Sex Distribution
            {!sexData && (
              <span className="ml-2 text-xs">(Unavailable)</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("age")}
            disabled={!ageData}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "age"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            } ${!ageData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Age Distribution
            {!ageData && (
              <span className="ml-2 text-xs">(Unavailable)</span>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="xl:col-span-2">
            <div className="bg-dark-border p-4 md:p-6 rounded-xl shadow-md">
              {currentData ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{getCurrentTitle()}</h3>
                      <p className="text-sm text-[#9dabb9]">
                        {chartType === "3d"
                          ? `Interactive 3D visualization with ${currentData.categories.length} categories`
                          : `Interactive donut chart showing ${currentData.categories.length} categories`
                        }
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => setChartType("3d")}
                        className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs md:text-sm transition-colors ${
                          chartType === "3d"
                            ? "bg-primary-blue text-white"
                            : "bg-[#3b4754] text-white hover:bg-[#4b5764]"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                        </svg>
                        <span className="hidden sm:inline">3D Chart</span>
                      </button>
                      <button
                        onClick={() => setChartType("donut")}
                        className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs md:text-sm transition-colors ${
                          chartType === "donut"
                            ? "bg-primary-blue text-white"
                            : "bg-[#3b4754] text-white hover:bg-[#4b5764]"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        </svg>
                        <span className="hidden sm:inline">Donut</span>
                      </button>
                    </div>
                  </div>

                  {/* Info banner for single-category datasets */}
                  {currentData.categories.length === 1 && activeTab === "diagnosis" && currentData.categories[0].name === "Healthy" && (
                    <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start space-x-2">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-300 font-medium">Healthy Control Study</p>
                        <p className="text-xs text-blue-400/80 mt-1">This dataset contains only healthy participants. Try viewing <span className="font-medium">Sex Distribution</span> or <span className="font-medium">Age Distribution</span> for more insights.</p>
                      </div>
                    </div>
                  )}

                  {/* Missing data warning */}
                  {hasMissingData && (
                    <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start space-x-2">
                      <svg className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-orange-300 font-medium">Incomplete {activeTab === "diagnosis" ? "Diagnosis" : activeTab === "sex" ? "Sex" : "Age"} Data</p>
                        <p className="text-xs text-orange-400/80 mt-1">
                          {activeTab === "diagnosis" && `Diagnosis information is missing for ${missingCount} participant${missingCount !== 1 ? 's' : ''}. `}
                          {activeTab === "sex" && `Sex information is missing for ${missingCount} participant${missingCount !== 1 ? 's' : ''}. `}
                          {activeTab === "age" && `Age information is missing for ${missingCount} participant${missingCount !== 1 ? 's' : ''}. `}
                          Chart shows only participants with available data ({dataCompleteness}% of total).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Chart Visualization - Responsive height */}
                  <div className="relative h-[300px] sm:h-[400px] md:h-[450px] bg-eerie-black rounded-lg overflow-hidden">
                    {chartType === "3d" ? (
                      <BarChart3D
                        data={currentData.categories}
                        totalSubjects={currentData.totalSubjects}
                        activeCategory={selectedCategory}
                        onBarClick={(categoryName) => setSelectedCategory(categoryName)}
                      />
                    ) : (
                      <DonutChart
                        data={currentData.categories}
                        totalSubjects={currentData.totalSubjects}
                        activeCategory={selectedCategory}
                        onSegmentClick={(categoryName) => setSelectedCategory(categoryName)}
                      />
                    )}
                  </div>

                  <div className="mt-4 text-xs text-[#9dabb9] flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Controls: Drag to rotate • Scroll to zoom • Click bar for details</span>
                  </div>
                </>
              ) : (
                <EmptyState
                  message={`${getCurrentTitle()} data not available for this dataset`}
                  suggestion="Try switching to another demographic view if available"
                />
              )}
            </div>
          </div>

          {/* Right Sidebar - Insights */}
          <div className="xl:col-span-1 space-y-6">
            {currentData ? (
              <>
                {/* Data Insights Card */}
                <div className="bg-dark-border p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-white">Data Insights</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-blue/10 p-4 rounded-lg">
                      <p className="text-sm text-[#9dabb9]">Total Participants</p>
                      <p className="text-3xl font-bold text-primary-blue">{currentData.totalSubjects}</p>
                      {hasMissingData && (
                        <p className="text-xs text-[#9dabb9] mt-1">
                          {currentData.totalWithData} with {activeTab} data
                        </p>
                      )}
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-lg">
                      <p className="text-sm text-[#9dabb9]">Average Age</p>
                      <p className="text-3xl font-bold text-blue-500">{currentData.averageAge.toFixed(1)}</p>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg">
                      <p className="text-sm text-[#9dabb9]">Most Common</p>
                      <p className="text-xl font-bold text-green-500">{currentData.categories[0].count}</p>
                      <p className="text-xs text-[#9dabb9] truncate">{currentData.categories[0].name}</p>
                    </div>
                    <div className="bg-red-500/10 p-4 rounded-lg">
                      <p className="text-sm text-[#9dabb9]">Least Common</p>
                      <p className="text-xl font-bold text-red-500">{currentData.categories[currentData.categories.length - 1].count}</p>
                      <p className="text-xs text-[#9dabb9] truncate">{currentData.categories[currentData.categories.length - 1].name}</p>
                    </div>
                  </div>
                  
                  {/* Data Completeness Indicator */}
                  {hasMissingData && (
                    <div className="mt-4 pt-4 border-t border-[#3b4754]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#9dabb9]">Data Completeness</span>
                        <span className="text-sm font-medium text-white">{dataCompleteness}%</span>
                      </div>
                      <div className="w-full bg-[#3b4754] rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${dataCompleteness}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#9dabb9] mt-2">
                        {missingCount} participant{missingCount !== 1 ? 's' : ''} missing {activeTab} data
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Findings Card */}
                <div className="bg-dark-border p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-white">Key Findings</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div className="text-white">
                        <span className="font-medium">Total subjects: {currentData.totalSubjects}</span>
                        {hasMissingData && (
                          <span className="block text-xs text-[#9dabb9] mt-1">
                            ({currentData.totalWithData} with {activeTab} data, {missingCount} missing)
                          </span>
                        )}
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      </svg>
                      <div className="text-white">
                        <span className="font-medium">Most common {activeTab === "diagnosis" ? "diagnosis" : activeTab === "sex" ? "sex" : "age group"}:</span> {currentData.categories[0].name} ({currentData.categories[0].percentage.toFixed(1)}%)
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      <div className="text-white">
                        <span className="font-medium">Least common {activeTab === "diagnosis" ? "diagnosis" : activeTab === "sex" ? "sex" : "age group"}:</span> {currentData.categories[currentData.categories.length - 1].name} ({currentData.categories[currentData.categories.length - 1].percentage.toFixed(1)}%)
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <div className="text-white">
                        <span className="font-medium">Average Age:</span> {currentData.averageAge.toFixed(1)} years
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Distribution Card */}
                <div className="bg-dark-border p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-white">Distribution</h3>
                  <div className="space-y-3">
                    {currentData.categories.map((category, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex justify-between mb-1 text-white">
                          <span>{idx + 1}. {category.name}</span>
                          <span className="font-medium">{category.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[#3b4754] rounded-full h-2">
                          <div
                            className={`${category.color} h-2 rounded-full transition-all`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-dark-border p-6 rounded-xl shadow-md">
                <EmptyState
                  message="No insights available"
                  suggestion="Select a different demographic view to see insights"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataVisualization;
