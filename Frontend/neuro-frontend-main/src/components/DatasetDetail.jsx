import { useParams, useNavigate } from "react-router-dom";

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample dataset information
  const datasetInfo = {
    "midnight-scan-club": {
      title: "Midnight Scan Club",
      name: "Midnight Scan Club"
    },
    "human-connectome": {
      title: "Human Connectome Project",
      name: "Human Connectome Project"
    },
    "adni": {
      title: "Alzheimer's Disease Neuroimaging Initiative",
      name: "ADNI Study"
    },
    "abide": {
      title: "Autism Brain Imaging Data Exchange",
      name: "ABIDE Dataset"
    }
  };

  const dataset = datasetInfo[id] || { title: "Dataset", name: "Unknown Dataset" };

  // Sample participant data
  const participants = [
    { id: "participant_01", age: 25, sex: "Male", handedness: "Right", intervals: "Interval 1, Interval 2" },
    { id: "participant_02", age: 30, sex: "Female", handedness: "Left", intervals: "Interval 1" },
    { id: "participant_03", age: 22, sex: "Male", handedness: "Right", intervals: "Interval 2" },
    { id: "participant_04", age: 28, sex: "Female", handedness: "Right", intervals: "Interval 1, Interval 2" },
    { id: "participant_05", age: 24, sex: "Male", handedness: "Left", intervals: "Interval 1" },
    { id: "participant_06", age: 29, sex: "Female", handedness: "Right", intervals: "Interval 2" },
    { id: "participant_07", age: 26, sex: "Male", handedness: "Right", intervals: "Interval 1, Interval 2" },
    { id: "participant_08", age: 31, sex: "Female", handedness: "Left", intervals: "Interval 1" },
    { id: "participant_09", age: 23, sex: "Male", handedness: "Right", intervals: "Interval 2" },
    { id: "participant_10", age: 27, sex: "Female", handedness: "Right", intervals: "Interval 1, Interval 2" }
  ];

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Participant Data</p>
            <p className="text-[#9dabb9] text-sm font-normal leading-normal">Dataset: {dataset.name}</p>
          </div>
          <button
            onClick={() => navigate('/datasets')}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary-blue text-white text-sm font-medium leading-normal hover:bg-secondary-blue transition-colors"
          >
            <span className="truncate">Data Visualization</span>
          </button>
        </div>
        <div className="px-4 py-3">
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
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;