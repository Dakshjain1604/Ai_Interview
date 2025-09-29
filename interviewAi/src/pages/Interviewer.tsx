import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Card, Table, Tag, Empty, Statistic, Row, Col } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, CodeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Candidate } from '../redux/slices/interviewSlice';

const Interviewer: React.FC = () => {
  const candidates = useSelector((state: RootState) => state.interview.candidates);
  const questions = useSelector((state: RootState) => state.interview.questions);

  const completedCandidates = candidates.filter(c => c.score !== null);
  const averageScore = completedCandidates.length > 0
    ? Math.round(completedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / completedCandidates.length)
    : 0;

  const columns: ColumnsType<Candidate> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-'
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      render: (score) => {
        if (score === null) return <Tag color="orange">In Progress</Tag>;
        
        const color = score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red';
        return <Tag color={color} style={{ fontSize: 14, padding: '4px 12px' }}>{score}/100</Tag>;
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        record.score !== null ? (
          <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="processing">In Progress</Tag>
        )
      )
    },
    {
      title: 'Completed At',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? new Date(date).toLocaleString() : '-'
    }
  ];

  const expandedRowRender = (record: Candidate) => {
    return (
      <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: 8 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Card size="small" title="AI Evaluation Summary" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                {record.summary || 'No summary available'}
              </p>
            </Card>
          </Col>
        </Row>
        
        <Card size="small" title="Interview Questions & Answers">
          {record.answers.length > 0 ? (
            <div>
              {questions.map((question, index) => (
                <div key={index} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>Question {index + 1}</strong>
                    <Tag color={question.level === 'Easy' ? 'green' : question.level === 'Medium' ? 'orange' : 'red'}>
                      {question.level}
                    </Tag>
                  </div>
                  <p style={{ color: '#666', marginBottom: 8 }}>{question.text}</p>
                  <div style={{ backgroundColor: '#fff', padding: 12, borderRadius: 4, border: '1px solid #e8e8e8' }}>
                    <strong>Answer:</strong>
                    <p style={{ margin: '8px 0 0 0' }}>
                      {record.answers[index] || <em style={{ color: '#999' }}>No answer provided</em>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No answers recorded yet" />
          )}
        </Card>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Interview Dashboard</h1>
        <p style={{ color: '#666' }}>
          <CodeOutlined /> React & Node.js Technical Interviews
        </p>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Candidates"
              value={candidates.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Completed Interviews"
              value={completedCandidates.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Score"
              value={averageScore}
              suffix="/ 100"
              valueStyle={{ color: averageScore >= 70 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="All Candidates">
        {candidates.length === 0 ? (
          <Empty 
            description="No candidates yet. Start an interview to see data here."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={candidates}
            rowKey="id"
            expandable={{ expandedRowRender }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default Interviewer;