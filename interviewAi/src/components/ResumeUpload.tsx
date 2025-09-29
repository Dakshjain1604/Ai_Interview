import React, { useState } from 'react';
import { Card, Upload, Button, Input, Form, Alert, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { parseResume } from '../utils/resumeParser';

import  type {ExtractedData } from '../utils/resumeParser';

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
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <Card title="Upload Your Resume">
        {error && <Alert message={error} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 16 }} />}

        <Upload.Dragger
          accept=".pdf,.doc,.docx,.txt"
          beforeUpload={handleUpload}
          maxCount={1}
          disabled={loading}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag resume to upload</p>
          <p className="ant-upload-hint">Supports PDF, DOC, DOCX, TXT</p>
        </Upload.Dragger>

        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin size="large" />
            <p>Parsing resume...</p>
          </div>
        )}

        {extractedData && !loading && (
          <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
            <Alert message="Please verify your information" type="info" style={{ marginBottom: 16 }} />
            
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
  );
};

export default ResumeUpload;