import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const DataVisualization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("diagnosis");

  // Sample dataset information
  const datasetInfo = {
    "midnight-scan-club": {
      name: "Midnight Scan Club",
      description: "This dataset includes fMRI recordings from participants performing various cognitive tasks.",
      participants: 10,
      tasks: 8,
      modality: "fMRI"
    },
    "human-connectome": {
      name: "Human Connectome Project",
      description: "This dataset includes comprehensive brain mapping data from healthy adults.",
      participants: 1200,
      tasks: 12,
      modality: "fMRI, dMRI"
    },
    "adni": {
      name: "ADNI Study",
      description: "This dataset includes longitudinal MRI and cognitive data for Alzheimer's research.",
      participants: 800,
      tasks: 15,
      modality: "MRI, PET"
    },
    "abide": {
      name: "ABIDE Dataset",
      description: "This dataset includes MRI recordings from participants with autism spectrum disorder.",
      participants: 539,
      tasks: 6,
      modality: "MRI"
    }
  };

  const dataset = datasetInfo[id] || {
    name: "MEG Study on Cognitive Tasks",
    description: "This dataset includes MEG recordings from participants performing various cognitive tasks.",
    participants: 100,
    tasks: 5,
    modality: "MEG"
  };

  // Sample data for visualizations
  const diagnosisData = {
    totalSubjects: 205,
    averageAge: 68.3,
    categories: [
      { name: "Autism", count: 85, percentage: 41.5, color: "bg-blue-500" },
      { name: "Healthy", count: 70, percentage: 34.1, color: "bg-green-500" },
      { name: "ADHD", count: 50, percentage: 24.4, color: "bg-red-500" }
    ]
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Left Sidebar - Dataset Summary */}
      <aside className="w-80 bg-dark-border p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <svg className="w-10 h-10 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">NeuroVerse</h1>
          </div>

          <h2 className="text-lg font-semibold mb-6 text-white">Dataset Summary</h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-[#9dabb9]">Dataset Name</p>
              <p className="font-medium text-white">{dataset.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#9dabb9]">Description</p>
              <p className="text-sm text-white">{dataset.description}</p>
            </div>
            <div className="border-t border-[#3b4754]"></div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Number of Participants</p>
              <p className="font-semibold text-lg text-white">{dataset.participants}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Number of Tasks</p>
              <p className="font-semibold text-lg text-white">{dataset.tasks}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9dabb9]">Modalities</p>
              <p className="font-medium text-sm bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">{dataset.modality}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto bg-eerie-black">
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex min-w-72 flex-col gap-3">
            <h1 className="text-4xl font-bold mb-2 text-white">Visualization Dashboard</h1>
            <p className="text-[#9dabb9] text-lg">Explore the metadata of the selected dataset through interactive charts.</p>
          </div>
          <button
            onClick={() => navigate('/datasets')}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors"
          >
            <span className="truncate">Back to Datasets</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-[#3b4754] mb-6">
          <button
            onClick={() => setActiveTab("diagnosis")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "diagnosis"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            }`}
          >
            Diagnosis Distribution
          </button>
          <button
            onClick={() => setActiveTab("sex")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "sex"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            }`}
          >
            Sex Distribution
          </button>
          <button
            onClick={() => setActiveTab("age")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "age"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-[#9dabb9] hover:text-white"
            }`}
          >
            Age Distribution
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Chart Area (2 columns) */}
          <div className="col-span-2">
            <div className="bg-dark-border p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">Diagnosis Distribution</h3>
                  <p className="text-sm text-[#9dabb9]">Interactive 3D visualization with 3 categories</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                    </svg>
                    <span>3D Bar Chart</span>
                  </button>
                  <button className="bg-[#3b4754] text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-[#4b5764] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>2D Scatter Plot</span>
                  </button>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="relative h-[450px] bg-eerie-black rounded-lg overflow-hidden flex items-end justify-center p-8 gap-8">
                {diagnosisData.categories.map((category, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div
                      className={`w-24 ${category.color} rounded-t-lg transition-all hover:opacity-80`}
                      style={{ height: `${(category.count / diagnosisData.totalSubjects) * 400}px` }}
                    ></div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{category.name}</p>
                      <p className="text-[#9dabb9] text-sm">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-[#9dabb9] flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Controls: Drag to rotate • Scroll to zoom • Click bar for details</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Insights (1 column) */}
          <div className="col-span-1 space-y-6">
            {/* Data Insights Card */}
            <div className="bg-dark-border p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-white">Data Insights</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-primary-blue/10 p-4 rounded-lg">
                  <p className="text-sm text-[#9dabb9]">Total Subjects</p>
                  <p className="text-3xl font-bold text-primary-blue">{diagnosisData.totalSubjects}</p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <p className="text-sm text-[#9dabb9]">Average Age</p>
                  <p className="text-3xl font-bold text-blue-500">{diagnosisData.averageAge}</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <p className="text-sm text-[#9dabb9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Highest
                  </p>
                  <p className="text-xl font-bold text-green-500">{diagnosisData.categories[0].count}</p>
                  <p className="text-xs text-[#9dabb9]">{diagnosisData.categories[0].name}</p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg">
                  <p className="text-sm text-[#9dabb9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Lowest
                  </p>
                  <p className="text-xl font-bold text-red-500">{diagnosisData.categories[2].count}</p>
                  <p className="text-xs text-[#9dabb9]">{diagnosisData.categories[2].name}</p>
                </div>
              </div>
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
                    <span className="font-medium">Total subjects: {diagnosisData.totalSubjects}</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                  <div className="text-white">
                    <span className="font-medium">Most common diagnosis:</span> {diagnosisData.categories[0].name} ({diagnosisData.categories[0].percentage}%)
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <div className="text-white">
                    <span className="font-medium">Least common diagnosis:</span> {diagnosisData.categories[2].name} ({diagnosisData.categories[2].percentage}%)
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <div className="text-white">
                    <span className="font-medium">Clinical to healthy ratio:</span> 1.93:1
                  </div>
                </li>
              </ul>
            </div>

            {/* Distribution Card */}
            <div className="bg-dark-border p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-white">Distribution</h3>
              <div className="space-y-3">
                {diagnosisData.categories.map((category, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{idx + 1}. {category.name}</span>
                      <span className="font-medium">{category.percentage}%</span>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataVisualization;