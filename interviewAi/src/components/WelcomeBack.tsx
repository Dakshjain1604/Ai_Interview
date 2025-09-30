import React from 'react';
import { Card, Button } from 'antd';
import { RollbackOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface WelcomeBackProps {
  candidateName: string;
  questionsAnswered: number;
  totalQuestions: number;
  onContinue: () => void;
  onRestart: () => void;
}

const WelcomeBack: React.FC<WelcomeBackProps> = ({
  candidateName,
  questionsAnswered,
  totalQuestions,
  onContinue,
  onRestart
}) => {
  return (
    <div className=" w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
            <ClockCircleOutlined className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back, {candidateName}!
          </h1>
          <p className="text-lg text-gray-600">
            We found an unfinished interview
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="text-2xl font-bold text-blue-600">
                {questionsAnswered} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {totalQuestions - questionsAnswered} questions remaining
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="primary"
            size="large"
            block
            icon={<RollbackOutlined />}
            onClick={onContinue}
            className="h-14 text-lg font-semibold"
          >
            Continue Interview
          </Button>
          
          <Button
            danger
            size="large"
            block
            icon={<ReloadOutlined />}
            onClick={onRestart}
            className="h-14 text-lg font-semibold"
          >
            Start Fresh Interview
          </Button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Starting a fresh interview will discard your current progress. 
            This action cannot be undone.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeBack;