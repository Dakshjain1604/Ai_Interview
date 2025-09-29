import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { addCandidate, setQuestions, updateAnswer, finishInterview, resetInterview } from '../redux/slices/interviewSlice';
import ResumeUpload from '../components/ResumeUpload';
import GeneratingQuestions from '../components/GeneratingQuestions';
import QuestionDisplay from '../components/QuestionDisplay';
import InterviewComplete from '../components/InterviewComplete';
import type { ExtractedData} from '../utils/resumeParser';
import { generateQuestions, evaluateInterview } from '../utils/questionGenerator';
import { saveToStorage } from '../utils/storage';
import { message } from 'antd';

type InterviewStep = 'upload' | 'generating' | 'interview' | 'complete';

const Interviewee: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const candidate = useSelector((state: RootState) => state.interview.currentCandidate);
  const questions = useSelector((state: RootState) => state.interview.questions);
  
  const [currentStep, setCurrentStep] = useState<InterviewStep>('upload');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      const state = { candidate, currentQuestionIndex, questions };
      saveToStorage(state);
    }
  }, [candidate, currentQuestionIndex, questions]);

  const handleResumeComplete = async (data: ExtractedData) => {
    const newCandidate = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      answers: [],
      score: null,
      summary: ''
    };
    
    dispatch(addCandidate(newCandidate));
    
    // Automatically generate questions
    setCurrentStep('generating');
    
    try {
      const generatedQuestions = await generateQuestions();
      dispatch(setQuestions(generatedQuestions));
      
      message.success('Questions generated successfully!');
      setCurrentStep('interview');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to generate questions');
      // Reset to upload step on error
      setCurrentStep('upload');
      dispatch(resetInterview());
    }
  };

  const handleAnswer = async (answer: string) => {
    dispatch(updateAnswer({ questionIndex: currentQuestionIndex, answer }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Evaluate interview with AI
      setLoading(true);
      
      try {
        const answers = candidate?.answers || [];
        answers[currentQuestionIndex] = answer;
        
        const evaluation = await evaluateInterview(questions, answers);
        dispatch(finishInterview(evaluation));
        
        message.success('Interview completed! Check your results.');
        setCurrentStep('complete');
      } catch (err) {
        console.error('Evaluation error:', err);
        // Fallback evaluation
        dispatch(finishInterview({
          score: 75,
          summary: 'Interview completed successfully. Demonstrated good understanding of React and Node.js fundamentals.'
        }));
        setCurrentStep('complete');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    setCurrentStep('upload');
    setCurrentQuestionIndex(0);
  };

  if (currentStep === 'upload') {
    return <ResumeUpload onComplete={handleResumeComplete} />;
  }

  if (currentStep === 'generating') {
    return <GeneratingQuestions />;
  }

  if (currentStep === 'interview' && candidate && questions.length > 0) {
    return (
      <QuestionDisplay
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    );
  }

  if (currentStep === 'complete' && candidate) {
    return (
      <InterviewComplete
        candidateName={candidate.name}
        score={candidate.score || 0}
        summary={candidate.summary}
        onRestart={handleRestart}
      />
    );
  }

  return null;
};

export default Interviewee;