import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

interface Candidate {
  name: string;
  email: string;
  phone: string;
}

interface CandidateSuccessProps {
  candidate: Candidate;
  onStartInterview: () => void;
}

const CandidateSuccess: React.FC<CandidateSuccessProps> = ({
  candidate,
  onStartInterview,
}) => {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Resume Processed Successfully!
          </h2>
        </div>

        {/* Candidate Info */}
        <div className="mb-6 space-y-2 text-gray-700 text-base">
          <p>
            <strong>Name:</strong> {candidate.name}
          </p>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          {candidate.phone && (
            <p>
              <strong>Phone:</strong> {candidate.phone}
            </p>
          )}
        </div>

        {/* Info Text */}
        <p className="text-gray-500 mb-6">
          Your information has been processed. You can now start the technical
          interview.
        </p>

        {/* Button */}
        <button
          onClick={onStartInterview}
          className="min-w-[200px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default CandidateSuccess;
