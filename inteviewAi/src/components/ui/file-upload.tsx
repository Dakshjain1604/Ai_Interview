// components/ui/file-upload.tsx
import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;

interface FileUploadProps {
  onUploaded?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploaded }) => {
  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        const fileObj = info.file.originFileObj as File;
        console.log("File object:", fileObj);

        const reader = new FileReader();
        reader.onload = (e) => {
          console.log("File content:", e.target?.result);
        };
        reader.readAsText(fileObj);
      }

      if (status === "done") {
        message.success(`${info.file.name} uploaded successfully.`);
        onUploaded?.(); // 🔥 switch tab after upload
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single file upload. Don’t upload sensitive data.
      </p>
    </Dragger>
  );
};

export default FileUpload;
