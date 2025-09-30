import React, { useState, useEffect, useRef } from 'react';
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
  onAnswer: (answer: string) => Promise<void> | void; // support async
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer
}) => {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(question.time);
  const [loading, setLoading] = useState(false); // 🔹 loading state added
  const answerRef = useRef(answer);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    setTimeLeft(question.time);
    setAnswer('');
  }, [questionNumber, question.time]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onAnswer(answerRef.current);
    } finally {
      setLoading(false);
    }
  };

  const levelColors: Record<Question['level'], string> = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red'
  };

  return (
    <div className='w-screen px-20'>
      <h3 className='text-3xl font-bold mb-5 animate'>total questions : 6</h3>
      <Card>
      <div className=" flex justify-between items-center mb-2">
        <h3>Question {questionNumber} of {totalQuestions}</h3>
        <Tag color={levelColors[question.level]}>{question.level}</Tag>
      </div>

      <Progress percent={(timeLeft / question.time) * 100} showInfo={false} />
      <p className="mt-2 text-red-500">Time Left: {timeLeft}s</p>

      <p className="mt-4">{question.text}</p>

      <Input.TextArea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
        className="mb-4"
      />

      <Button
       className='mt-10'
        type="primary"
        onClick={handleSubmit}
        loading={loading} // 🔹 show loading on button
        block
      >
        {questionNumber === totalQuestions ? 'Finish Interview' : 'Next Question'}
      </Button>
    </Card>
    </div>
  );
};

export default QuestionDisplay;
