import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Progress, Tag } from 'antd';

interface Question {
  text: string;
  level: 'Easy' | 'Medium' | 'Hard';
  time: number;
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer
}) => {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(question.time);

  useEffect(() => {
    setTimeLeft(question.time);
    setAnswer('');
  }, [questionNumber, question.time]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onAnswer(answer);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answer, onAnswer]);

  const handleSubmit = () => {
    onAnswer(answer);
  };

  const levelColors = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red'
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <Card>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Question {questionNumber} of {totalQuestions}</h3>
            <Tag color={levelColors[question.level]}>{question.level}</Tag>
          </div>
          <Progress 
            percent={(timeLeft / question.time) * 100} 
            showInfo={false}
            status={timeLeft < 10 ? 'exception' : 'active'}
          />
          <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
            Time Left: {timeLeft}s
          </p>
        </div>

        <div style={{ backgroundColor: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <p style={{ fontSize: 16, margin: 0 }}>{question.text}</p>
        </div>

        <Input.TextArea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          style={{ marginBottom: 16 }}
        />

        <Button type="primary" size="large" block onClick={handleSubmit}>
          {questionNumber === totalQuestions ? 'Finish Interview' : 'Next Question'}
        </Button>
      </Card>
    </div>
  );
};

export default QuestionDisplay;