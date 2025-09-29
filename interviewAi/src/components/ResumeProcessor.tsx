import React from "react";
import { UploadOutlined, FileTextOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";

interface ResumeProcessorProps {
  uploadedFile: File | null;
  isProcessing: boolean;
  onProcess: () => void;
  onExtractedText?: (text: string) => void;
}

const ResumeProcessor: React.FC<ResumeProcessorProps> = ({
  uploadedFile,
  isProcessing,
  onProcess,
}) => {
  if (!uploadedFile) {
    return null;
  }

  // Helper function to get file icon
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FilePdfOutlined className="text-red-500 text-xl" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FileWordOutlined className="text-blue-500 text-xl" />;
    return <FileTextOutlined className="text-gray-500 text-xl" />;
  };

  // Helper function to get file type display name
  const getFileTypeName = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF Document";
    if (fileType.includes("word") || fileType.includes("document")) return "Word Document";
    if (fileType.includes("text")) return "Text File";
    return "Document";
  };
  return (
    <div className=" max-h-[800px] bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Process Resume</h2>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          {getFileIcon(uploadedFile.type)}
          <span className="ml-2 font-bold text-gray-700">{uploadedFile.name}</span>
        </div>
        <p className="text-sm text-gray-600">
          <strong>File size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB
        </p>
        <p className="text-sm text-gray-600">
          <strong>File type:</strong> {getFileTypeName(uploadedFile.type)}
        </p>
      </div>

      {isProcessing && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-1/2 animate-pulse"></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Extracting text from {getFileTypeName(uploadedFile.type).toLowerCase()}...
          </p>
        </div>
      )}

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className={`flex items-center justify-center w-full py-3 px-4 rounded-lg text-white font-medium transition ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <UploadOutlined className="mr-2" />
        {isProcessing
          ? "Processing Resume..."
          : `Extract Information from ${getFileTypeName(uploadedFile.type)}`}
      </button>
    </div>
  );
};

export default ResumeProcessor;
