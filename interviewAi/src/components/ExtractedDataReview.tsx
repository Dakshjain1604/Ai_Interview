import React, { useState, useEffect } from 'react';
import { Card, Alert, Input, Button, Form } from 'antd';

interface ExtractedData {
  name: string;
  email: string;
  phone: string;
}

interface ExtractedDataReviewProps {
  extractedData: ExtractedData;
  onProceed: (data: ExtractedData) => void;
  onEdit: (data: ExtractedData) => void;
}

const ExtractedDataReview: React.FC<ExtractedDataReviewProps> = ({
  extractedData,
  onProceed,
  onEdit
}) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(extractedData);

  useEffect(() => {
    setEditedData(extractedData);
    form.setFieldsValue(extractedData);
  }, [extractedData, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      setEditedData(values);
      onEdit(values);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditedData(extractedData);
    form.setFieldsValue(extractedData);
    setIsEditing(false);
  };

  const handleProceed = () => {
    onProceed(editedData);
  };

  const hasValidData = editedData.name || editedData.email;

  return (
    <Card title="Extracted Information" style={{ marginTop: 20 }}>
      <Alert
        message="Please verify the information below"
        description="If the information is incorrect, you can edit it manually before proceeding."
        type="info"
        className='mb-16'
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={extractedData}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input 
            disabled={!isEditing}
            placeholder="Enter your full name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            disabled={!isEditing}
            placeholder="Enter your email address"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
        >
          <Input 
            disabled={!isEditing}
            placeholder="Enter your phone number (optional)"
            size="large"
          />
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', gap: '12px', marginTop: 20 }}>
        {!isEditing ? (
          <>
            <Button onClick={handleEdit} size="large">
              Edit Information
            </Button>
            <Button 
              type="primary" 
              size="large"
              disabled={!hasValidData}
              onClick={handleProceed}
              className='flex-1'
            >
              Proceed to Interview
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleSave}
              size="large"
              className='flex-1'
              
            >
              Save Changes
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ExtractedDataReview;