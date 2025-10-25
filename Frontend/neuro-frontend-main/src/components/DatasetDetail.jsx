import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { datasetAPI } from "../services/api";

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatasetDetails();
  }, [id]);

  const fetchDatasetDetails = async () => {
    try {
      setLoading(true);
      // Fetch dataset details from backend
      const response = await datasetAPI.getDatasetById(id);
      const datasetData = response.data;

      setDataset({
        title: datasetData.name || datasetData.openneuro_id,
        name: datasetData.name || datasetData.openneuro_id
      });

      // Fetch real participants from backend
      const participantsResponse = await datasetAPI.getParticipants(id);
      const backendParticipants = participantsResponse.data;

      // Map backend participants to match the table structure
      const mappedParticipants = backendParticipants.map(participant => ({
        id: participant.participant_id,
        age: participant.age || "N/A",
        sex: participant.sex || "N/A",
        handedness: participant.handedness || "N/A",
        intervals: participant.group || "N/A"  // Using group field for intervals
      }));

      setParticipants(mappedParticipants);
    } catch (error) {
      console.error("Error fetching dataset details:", error);
      // Fallback to default
      setDataset({ title: "Dataset", name: "Unknown Dataset" });
      setParticipants([]);
    } finally {
      setLoading(false);
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
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Participant Data</p>
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Dataset: {dataset.name}</p>
          </div>
          <button
            onClick={() => navigate(`/datasets/${id}/visualize`)}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors"
          >
            <span className="truncate">Data Visualization</span>
          </button>
        </div>
        <div className="px-4 py-3">
          {participants.length === 0 ? (
            <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-8 text-center">
              <p className="text-[#9dabb9] text-sm">No participant data available for this dataset.</p>
            </div>
          ) : (
            <div className="flex overflow-hidden rounded-lg border border-[#3b4754] bg-[#111418]">
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1c2127]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        participant_id
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">age</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">sex</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">handedness</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        MEG intervals
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index} className="border-t border-t-[#3b4754]">
                        <td className="h-[72px] px-4 py-2 text-white text-sm font-normal leading-normal">
                          {participant.id}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#9dabb9] text-sm font-normal leading-normal">
                          {participant.age}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#9dabb9] text-sm font-normal leading-normal">
                          {participant.sex}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#9dabb9] text-sm font-normal leading-normal">
                          {participant.handedness}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#9dabb9] text-sm font-normal leading-normal">
                          {participant.intervals}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
