import React from 'react';
import { Card, Result, Button, Descriptions } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface InterviewCompleteProps {
  candidateName: string;
  score: number;
  summary: string;
  onRestart: () => void;
}

const InterviewComplete: React.FC<InterviewCompleteProps> = ({
  candidateName,
  score,
  summary,
  onRestart
}) => {
  return (
    <div className="max-w-full mx-auto my-10 px-5 text-white">
      <Result
        icon={<CheckCircleOutlined className="text-green-500 text-4xl"/>}
        title={<span className="text-white text-3xl font-bold">Interview Completed!</span>}
        subTitle={<span className="text-white">Thank you {candidateName} for completing the interview.</span>}
        extra={[
          <Button type="primary" size="large" onClick={onRestart} key="restart">
            Start New Interview
          </Button>
        ]}
      >
        <Card className="mt-4">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Candidate Name">{candidateName}</Descriptions.Item>
            <Descriptions.Item label="Score">{score}/100</Descriptions.Item>
            <Descriptions.Item label="Summary">{summary}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Result>
    </div>
  );
};

export default InterviewComplete;
