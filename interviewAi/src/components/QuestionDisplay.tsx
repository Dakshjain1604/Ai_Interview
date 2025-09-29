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
    <div className="max-w-full mx-auto my-10 px-5">
      <Card>
        <div className="mb-5">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Question {questionNumber} of {totalQuestions}</h3>
            <Tag color={levelColors[question.level]}>{question.level}</Tag>
          </div>
          <Progress 
            percent={(timeLeft / question.time) * 100} 
            showInfo={false}
            status={timeLeft < 10 ? 'exception' : 'active'}
          />
          <p className="text-center text-lg font-bold mt-2">
            Time Left: {timeLeft}s
          </p>
        </div>

        <div className="bg-gray-100 p-5 rounded-lg mb-5">
          <p className="text-base m-0">{question.text}</p>
        </div>

        <Input.TextArea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          className="mb-4"
        />

        <Button type="primary" size="large" block onClick={handleSubmit}>
          {questionNumber === totalQuestions ? 'Finish Interview' : 'Next Question'}
        </Button>
      </Card>
    </div>
  );
};

export default QuestionDisplay;