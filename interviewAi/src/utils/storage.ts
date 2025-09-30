import type { Candidate, Question } from '../redux/slices/interviewSlice';

const STORAGE_KEY = 'interview_state';

export interface StoredInterviewState {
  candidate: Candidate | null;
  questions: Question[];
  currentQuestionIndex: number;
  questionsGenerated: boolean;
  timestamp: number;
}

export const saveInterviewState = (state: Omit<StoredInterviewState, 'timestamp'>) => {
  try {
    const dataToSave: StoredInterviewState = {
      ...state,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadInterviewState = (): StoredInterviewState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data) as StoredInterviewState;
    
    // Check if data is from last 24 hours
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > ONE_DAY) {
      clearInterviewState();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const clearInterviewState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// For interviewer dashboard - separate storage
const CANDIDATES_KEY = 'interview_candidates';

export const saveCandidates = (candidates: Candidate[]) => {
  try {
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error('Error saving candidates:', error);
  }
};

export const loadCandidates = (): Candidate[] => {
  try {
    const data = localStorage.getItem(CANDIDATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading candidates:', error);
    return [];
  }
};