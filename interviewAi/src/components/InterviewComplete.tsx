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
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="Interview Completed!"
        subTitle={`Thank you ${candidateName} for completing the interview.`}
        extra={[
          <Button type="primary" size="large" onClick={onRestart} key="restart">
            Start New Interview
          </Button>
        ]}
      >
        <Card>
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