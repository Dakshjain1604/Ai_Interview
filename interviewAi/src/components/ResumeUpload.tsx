import React, { useState } from 'react';
import { Card, Upload, Button, Input, Form, Alert, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { parseResume } from '../utils/resumeParser';
import type { ExtractedData } from '../utils/resumeParser';
import { Link } from 'react-router-dom';

interface ResumeUploadProps {
  onComplete: (data: ExtractedData) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onComplete }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const data = await parseResume(file);
      setExtractedData(data);
      form.setFieldsValue({ name: data.name, email: data.email, phone: data.phone });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (extractedData) {
        onComplete({ ...extractedData, ...values });
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
 
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: "32px 32px",
      WebkitMaskImage:
         "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
      maskImage:
         "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
    }}
  />
      <nav className='flex z-20 relative pt-5 pl-10 top-0 left-0 gap-5'>
        <Link to='/'className='  bg-black text-white border-1 border-white p-2 rounded-xl' >Home </Link>
        <Link to='/interviewer'className='  bg-black text-white border-1 border-white p-2 rounded-xl' >DashBoard</Link>
      </nav>
     <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='text-8xl font-bold text-white z-50'>Let's See What You've Got !</div>
      <div className="w-[400px] mx-auto my-10 px-5">
      <Card title="Upload Your Resume">
        {error && <Alert message={error} type="error" closable onClose={() => setError(null)} className="mb-4" />}

        <Upload.Dragger
          accept=".pdf,.doc,.docx,.txt"
          beforeUpload={handleUpload}
          maxCount={1}
          disabled={loading}
          className="bg-gray-600 text-white border-gray-600 hover:bg-gray-700"
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag resume to upload</p>
          <p className="ant-upload-hint">Supports PDF, DOC, DOCX, TXT</p>
        </Upload.Dragger>
       

        {loading && (
          <div className="text-center my-5">
            <Spin size="large" />
            <p>Parsing resume...</p>
          </div>
        )}

        {extractedData && !loading && (
          <Form form={form} layout="vertical" className="mt-5">
            <Alert message="Please verify your information" type="info" className="mb-4" />
            
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Phone" name="phone">
              <Input size="large" />
            </Form.Item>

            <Button type="primary" size="large" block onClick={handleSubmit}>
              Start Interview
            </Button>
          </Form>
        )}
      </Card>
    </div>
    </div>
 
</div>
  );
};

export default ResumeUpload;




<div className="min-h-screen w-full bg-white relative">
  {/*  Diagonal Cross Grid Bottom Background */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: "40px 40px",
       WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
    }}
  />
  
</div>