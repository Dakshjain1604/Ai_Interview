import React from 'react';
import { Card, Spin } from 'antd';
import { LoadingOutlined, RocketOutlined } from '@ant-design/icons';

const GeneratingQuestions: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen mx-auto my-10 px-5">
      <Card className="text-center">
        <RocketOutlined className="text-6xl stroke-green-400 mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Generating Your Interview Questions</h2>
        <p className="text-gray-600 mb-8">
          Our AI is creating personalized React and Node.js questions for you...
        </p>
        
        <Spin 
          indicator={<LoadingOutlined className="text-5xl" spin />} 
          size="large"
        />
        
        <div className="mt-8 text-left bg-gray-100 p-4 rounded-lg">
          <h4 className="text-base font-semibold mb-3">What to expect:</h4>
          <ul className="pl-5 list-disc">
            <li>2 Easy questions (20 seconds each)</li>
            <li>2 Medium questions (60 seconds each)</li>
            <li>2 Hard questions (120 seconds each)</li>
          </ul>
          <p className="mt-4 text-xs text-gray-600">
            Questions will cover both React and Node.js concepts
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GeneratingQuestions;