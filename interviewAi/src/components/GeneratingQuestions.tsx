import React from 'react';
import { Card, Spin } from 'antd';
import { LoadingOutlined, RocketOutlined } from '@ant-design/icons';

const GeneratingQuestions: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <Card style={{ textAlign: 'center' }}>
        <RocketOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
        <h2>Generating Your Interview Questions</h2>
        <p style={{ color: '#666', marginBottom: 32 }}>
          Our AI is creating personalized React and Node.js questions for you...
        </p>
        
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
          size="large"
        />
        
        <div style={{ marginTop: 32, textAlign: 'left', backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}>
          <h4>What to expect:</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li>2 Easy questions (20 seconds each)</li>
            <li>2 Medium questions (60 seconds each)</li>
            <li>2 Hard questions (120 seconds each)</li>
          </ul>
          <p style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
            Questions will cover both React and Node.js concepts
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GeneratingQuestions;