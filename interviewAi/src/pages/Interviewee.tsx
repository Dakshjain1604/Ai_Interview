import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { 
  addCandidate, 
  setQuestions, 
  updateAnswer, 
  finishInterview, 
  resetInterview,
  restoreInterviewState 
} from '../redux/slices/interviewSlice';
import ResumeUpload from '../components/ResumeUpload';
import GeneratingQuestions from '../components/GeneratingQuestions';
import QuestionDisplay from '../components/QuestionDisplay';
import InterviewComplete from '../components/InterviewComplete';

import type { ExtractedData } from '../utils/resumeParser';
import { generateQuestions, evaluateInterview } from '../utils/questionGenerator';
import { 
  saveInterviewState, 
  loadInterviewState, 
  clearInterviewState 
} from '../utils/storage';
import { message } from 'antd';
import WelcomeBack from '@/components/WelcomeBack';

type InterviewStep = 'loading' | 'welcomeBack' | 'upload' | 'generating' | 'interview' | 'complete';

const Interviewee: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const candidate = useSelector((state: RootState) => state.interview.currentCandidate);
  const questions = useSelector((state: RootState) => state.interview.questions);
  
  const [currentStep, setCurrentStep] = useState<InterviewStep>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  //@ts-ignore
  const [loading, setLoading] = useState(false);

  // Check for saved state on component mount
  useEffect(() => {
    const checkForSavedState = () => {
      const savedState = loadInterviewState();
      
      if (savedState && 
          savedState.candidate && 
          savedState.questions.length > 0 &&
          savedState.candidate.score === null) {
        
        // Check if interview is incomplete
        const answeredCount = savedState.candidate.answers.filter(a => a && a.trim() !== '').length;
        
        if (answeredCount < savedState.questions.length) {
          // Restore the state
          dispatch(restoreInterviewState({
            candidate: savedState.candidate,
            questions: savedState.questions,
            currentQuestionIndex: savedState.currentQuestionIndex
          }));
          setCurrentQuestionIndex(savedState.currentQuestionIndex);
          setCurrentStep('welcomeBack');
          return;
        }
      }
      
      // No saved state or interview completed
      setCurrentStep('upload');
    };

    checkForSavedState();
  }, [dispatch]);

  // Auto-save state whenever it changes
  useEffect(() => {
    if (candidate && questions.length > 0 && candidate.score === null) {
      saveInterviewState({
        candidate,
        questions,
        currentQuestionIndex,
        questionsGenerated: true
      });
    }
  }, [candidate, questions, currentQuestionIndex]);

  const handleContinueInterview = () => {
    setCurrentStep('interview');
    message.info('Continuing your interview...');
  };

  const handleRestartInterview = () => {
    clearInterviewState();
    dispatch(resetInterview());
    setCurrentQuestionIndex(0);
    setCurrentStep('upload');
    message.info('Starting fresh interview');
  };

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
    
    setCurrentStep('generating');
    
    try {
      const generatedQuestions = await generateQuestions();
      dispatch(setQuestions(generatedQuestions));
      
      message.success('Questions generated successfully!');
      setCurrentStep('interview');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to generate questions');
      setCurrentStep('upload');
      dispatch(resetInterview());
    }
  };

  const handleAnswer = async (answer: string) => {
    dispatch(updateAnswer({ questionIndex: currentQuestionIndex, answer }));
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      try {
        const updatedAnswers = [...(candidate?.answers || [])];
        updatedAnswers[currentQuestionIndex] = answer;
  
        const evaluation = await evaluateInterview(questions, updatedAnswers);
  
        dispatch(finishInterview({
          score: evaluation.score,
          summary: evaluation.summary
        }));

        // Clear saved state after completion
        clearInterviewState();
  
        message.success('Interview completed! Check your results.');
        setCurrentStep('complete');
      } catch (err) {
        console.error('Evaluation error:', err);
        dispatch(finishInterview({
          score: 0,
          summary: 'Evaluation failed due to an error. Please try again.'
        }));
        clearInterviewState();
        setCurrentStep('complete');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestart = () => {
    clearInterviewState();
    dispatch(resetInterview());
    setCurrentStep('upload');
    setCurrentQuestionIndex(0);
  };

  // Loading state while checking for saved data
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your interview...</p>
        </div>
      </div>
    );
  }

  // Welcome back screen if saved state found
  if (currentStep === 'welcomeBack' && candidate) {
    const answeredCount = candidate.answers.filter(a => a && a.trim() !== '').length;
    
    return (
      <WelcomeBack
        candidateName={candidate.name}
        questionsAnswered={answeredCount}
        totalQuestions={questions.length}
        onContinue={handleContinueInterview}
        onRestart={handleRestartInterview}
      />
    );
  }

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
        // loading={loading}
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