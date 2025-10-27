import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { datasetAPI } from "../services/api";

const DatasetsPage = () => {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // Add sorting state
  const ITEMS_PER_PAGE = 18;

  // Dataset categories - reorganized into logical groups
  const categories = [
    { id: "all", name: "All Datasets", keywords: [] },
    
    // Clinical/Psychiatric
    { id: "mental_health", name: "Mental Health", keywords: ["depression", "anxiety", "mood", "stress", "ptsd", "psychiatric"] },
    { id: "neurological", name: "Neurological", keywords: ["schizophrenia", "autism", "adhd", "parkinson", "alzheimer", "epilepsy"] },
    
    // Research Type
    { id: "cognitive", name: "Cognitive Tasks", keywords: ["task", "test", "cognitive", "memory", "attention", "decision", "learning"] },
    { id: "social", name: "Social & Emotion", keywords: ["social", "emotion", "face", "theory of mind", "affective"] },
    
    // Data Type
    { id: "imaging", name: "Neuroimaging", keywords: ["mri", "fmri", "imaging", "scan", "brain"] },
    { id: "multimodal", name: "Multi-modal", keywords: ["multi-modal", "multimodal", "meg", "eeg"] },
  ];

  useEffect(() => {
    // Only fetch if we don't have datasets cached
    if (datasets.length === 0) {
      fetchDatasets();
    }
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await datasetAPI.getAllDatasets();
      setDatasets(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
      setError("Failed to load datasets. Please try again later.");
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort datasets
  const filteredDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dataset.openneuro_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === "all") return matchesSearch;
      
      const category = categories.find(cat => cat.id === selectedCategory);
      if (!category?.keywords) return matchesSearch;
      
      const matchesCategory = category.keywords.some(keyword => 
        dataset.name?.toLowerCase().includes(keyword)
      );
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "participants-desc":
          return (b.participant_count || 0) - (a.participant_count || 0);
        case "participants-asc":
          return (a.participant_count || 0) - (b.participant_count || 0);
        case "name":
        default:
          return (a.name || a.openneuro_id || "").localeCompare(b.name || b.openneuro_id || "");
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDatasets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDatasets = filteredDatasets.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Generate unique gradient based on dataset ID
  const generateGradient = (id) => {
    const colors = [
      ['#2094f3', '#1c7fd3'], // Blue
      ['#10b981', '#059669'], // Green
      ['#f59e0b', '#d97706'], // Orange
      ['#8b5cf6', '#7c3aed'], // Purple
      ['#ec4899', '#db2777'], // Pink
      ['#06b6d4', '#0891b2'], // Cyan
      ['#f97316', '#ea580c'], // Deep Orange
      ['#6366f1', '#4f46e5'], // Indigo
    ];
    
    const index = id % colors.length;
    const [color1, color2] = colors[index];
    
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-eerie-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-eerie-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={fetchDatasets}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-secondary-blue"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        {/* Header with Search */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">
              Available Datasets
            </p>
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">
              Browse and explore {filteredDatasets.length} neuroscience datasets
            </p>
          </div>
          
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-white bg-[#1c2127] border border-[#3b4754] focus:outline-0 focus:border-[#2094f3] text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="participants-desc">Most Participants</option>
              <option value="participants-asc">Fewest Participants</option>
            </select>

            {/* Search Bar */}
            <div className="flex w-full sm:w-[300px] items-stretch rounded-xl h-12 border border-[#3b4754] bg-[#1c2127]">
              <div className="text-[#9dabb9] flex items-center justify-center pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white focus:outline-0 placeholder:text-[#9dabb9] px-4 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills - Organized into rows */}
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-2">
            {/* First Row: All + Clinical */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>All Datasets</span>
                {selectedCategory === "all" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
              
              <div className="w-px bg-[#3b4754] mx-1"></div>
              
              <button
                onClick={() => setSelectedCategory("mental_health")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "mental_health"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Mental Health</span>
                {selectedCategory === "mental_health" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setSelectedCategory("neurological")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "neurological"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Neurological</span>
                {selectedCategory === "neurological" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Second Row: Research Types */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("cognitive")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "cognitive"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Cognitive Tasks</span>
                {selectedCategory === "cognitive" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setSelectedCategory("social")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "social"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Social & Emotion</span>
                {selectedCategory === "social" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setSelectedCategory("imaging")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "imaging"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Neuroimaging</span>
                {selectedCategory === "imaging" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setSelectedCategory("multimodal")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === "multimodal"
                    ? "bg-[#2094f3] text-white"
                    : "bg-[#1c2127] text-[#9dabb9] hover:bg-[#2a3441] hover:text-white"
                }`}
              >
                <span>Multi-modal</span>
                {selectedCategory === "multimodal" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filteredDatasets.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dataset Grid */}
        {currentDatasets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9dabb9] text-lg">No datasets found</p>
            <p className="text-[#9dabb9] text-sm mt-2">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-4">
            {currentDatasets.map((dataset) => (
              <div key={dataset.id} className="flex flex-col gap-3 pb-3">
                <div
                  onClick={() => navigate(`/datasets/${dataset.id}`)}
                  className="w-full bg-center bg-no-repeat aspect-video rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: generateGradient(dataset.id)
                  }}
                >
                  {/* Database/Document icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-white/10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  
                  {/* Dataset ID badge */}
                  <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
                    {dataset.nda_short_name || dataset.openneuro_id}
                  </div>
                </div>
                <div>
                  <p className="text-white text-base font-medium leading-normal">
                    {dataset.name || dataset.nda_short_name}
                  </p>
                  <p className="text-[#9dabb9] text-sm font-normal leading-normal line-clamp-2">
                    {dataset.description || "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-[#3b4754] text-[#9dabb9] cursor-not-allowed'
                  : 'bg-[#2094f3] text-white hover:bg-[#1c7fd3]'
              }`}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 rounded text-sm font-medium bg-[#1c2127] text-white hover:bg-[#2094f3] transition-colors"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 py-1 text-white">...</span>}
                </>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === currentPage ||
                         page === currentPage - 1 ||
                         page === currentPage - 2 ||
                         page === currentPage + 1 ||
                         page === currentPage + 2;
                })
                .map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#2094f3] text-white'
                        : 'bg-[#1c2127] text-white hover:bg-[#2094f3]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 py-1 text-white">...</span>}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 rounded text-sm font-medium bg-[#1c2127] text-white hover:bg-[#2094f3] transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-[#3b4754] text-[#9dabb9] cursor-not-allowed'
                  : 'bg-[#2094f3] text-white hover:bg-[#1c7fd3]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsPage;
