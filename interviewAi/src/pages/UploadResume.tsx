// UploadResume.tsx
import React from "react";
import FileUpload from "@/components/ui/file-upload";


interface Props {
  onUploaded: () => void;
}

const UploadResume: React.FC<Props> = ({ onUploaded }) => {
  return (
    <div className="bg-background h-full w-full flex justify-center items-center">
      <div className="absolute z-20">
        <FileUpload onUploaded={onUploaded} />        
      </div>
    </div>
  );
};

export default UploadResume;
