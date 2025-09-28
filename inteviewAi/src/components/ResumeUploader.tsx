import React from "react"
import { Upload, Card, Alert } from 'antd'
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Dragger } = Upload;


interface ResumeUploaderProps {
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    uploadFile: File | null;
    error: string | null;
    onErrorClose: () => void;
}


const ResumeUploader: React.FC<ResumeUploaderProps> = ({
    onFileSelect,
    onFileRemove,
    uploadFile,
    error,
    onErrorClose
}) => {
    const handleFileUpload = (file: File) => {
        console.log('File Selected', file.name, file.type);

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if(!allowedTypes.includes(file.type)){
            return false;
        }
        if(file.size>5*1024*1024){
            return false;
        }

        onFileSelect(file);
        return false;
    };

    const uploadProps: UploadProps = {
        name: 'resume',
        multiple: false,
        accept: '.pdf,.doc,.docx,',
        beforeUpload: handleFileUpload,
        onRemove: onFileRemove,
        fileList: uploadFile ? [{
          uid: '1',
          name: uploadFile.name,
          status: 'done',
          originFileObject: uploadFile
        }] : []
    };

    return (
        <Card title="Upload your Resume">
            <p className="mb-20"> Please upload your resume in PDF, DOC, DOCX  format. 
            We'll extract your basic information to start the interview process.</p>
            {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          style={{ marginBottom: 16 }}
          closable
          onClose={onErrorClose}
        />
      )}

<Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF, DOC, DOCX, and TXT files. Maximum file size: 5MB
        </p>
      </Dragger>
        </Card>
          
    );
   
}


export default ResumeUploader;