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

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      {/* Left Sidebar - Dataset Summary */}
      <div className="flex flex-col w-80">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Dataset Summary
        </h2>
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#3b4754] py-5">
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Dataset Name</p>
            <p className="text-white text-sm font-normal leading-normal">{dataset.name}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#3b4754] py-5">
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Description</p>
            <p className="text-white text-sm font-normal leading-normal">{dataset.description}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#3b4754] py-5">
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Number of Participants</p>
            <p className="text-white text-sm font-normal leading-normal">{dataset.participants}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#3b4754] py-5">
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Number of Tasks</p>
            <p className="text-white text-sm font-normal leading-normal">{dataset.tasks}</p>
          </div>
          <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#3b4754] py-5">
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Modalities</p>
            <p className="text-white text-sm font-normal leading-normal">{dataset.modality}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Visualization Dashboard */}
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">
              Visualization Dashboard
            </p>
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">
              Explore the metadata of the selected dataset through interactive charts.
            </p>
          </div>
          <button
            onClick={() => navigate('/datasets')}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors"
          >
            <span className="truncate">Back to Datasets</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="pb-3">
          <div className="flex border-b border-[#3b4754] px-4 gap-8">
            <button
              onClick={() => setActiveTab("diagnosis")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "diagnosis"
                  ? "border-b-white text-white"
                  : "border-b-transparent text-[#9dabb9]"
              }`}
            >
              <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                activeTab === "diagnosis" ? "text-white" : "text-[#9dabb9]"
              }`}>
                Diagnosis Distribution
              </p>
            </button>
            <button
              onClick={() => setActiveTab("sex")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "sex"
                  ? "border-b-white text-white"
                  : "border-b-transparent text-[#9dabb9]"
              }`}
            >
              <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                activeTab === "sex" ? "text-white" : "text-[#9dabb9]"
              }`}>
                Sex Distribution
              </p>
            </button>
            <button
              onClick={() => setActiveTab("age")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "age"
                  ? "border-b-white text-white"
                  : "border-b-transparent text-[#9dabb9]"
              }`}
            >
              <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                activeTab === "age" ? "text-white" : "text-[#9dabb9]"
              }`}>
                Age Distribution
              </p>
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex flex-wrap gap-4 px-4 py-6">
          {activeTab === "diagnosis" && (
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#3b4754] p-6">
              <p className="text-white text-base font-medium leading-normal">Diagnosis Distribution</p>
              <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">100</p>
              <div className="flex gap-1">
                <p className="text-[#9dabb9] text-base font-normal leading-normal">Total</p>
                <p className="text-[#0bda5b] text-base font-medium leading-normal">+10%</p>
              </div>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "70%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">Healthy</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "80%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">ADHD</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "100%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">Autism</p>
              </div>
            </div>
          )}

          {activeTab === "sex" && (
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#3b4754] p-6">
              <p className="text-white text-base font-medium leading-normal">Sex Distribution</p>
              <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">100</p>
              <div className="flex gap-1">
                <p className="text-[#9dabb9] text-base font-normal leading-normal">Total</p>
                <p className="text-[#0bda5b] text-base font-medium leading-normal">+5%</p>
              </div>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "85%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">Male</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "90%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">Female</p>
              </div>
            </div>
          )}

          {activeTab === "age" && (
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#3b4754] p-6">
              <p className="text-white text-base font-medium leading-normal">Age Distribution</p>
              <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">100</p>
              <div className="flex gap-1">
                <p className="text-[#9dabb9] text-base font-normal leading-normal">Total</p>
                <p className="text-[#0bda5b] text-base font-medium leading-normal">+8%</p>
              </div>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "40%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">18-25</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "100%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">26-35</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "60%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">36-45</p>
                <div className="border-[#9dabb9] bg-[#283039] border-t-2 w-full" style={{ height: "30%" }}></div>
                <p className="text-[#9dabb9] text-[13px] font-bold leading-normal tracking-[0.015em]">46+</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;