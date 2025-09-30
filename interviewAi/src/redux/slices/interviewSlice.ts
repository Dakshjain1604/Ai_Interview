import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { saveCandidates, loadCandidates } from "../../utils/storage";

export interface Question {
  text: string;
  level: "Easy" | "Medium" | "Hard";
  time: number;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  answers: string[];
  score: number | null;
  summary: string;
  completedAt?: string;
}

interface InterviewState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  questions: Question[];
  questionsGenerated: boolean;
}

// Load candidates from localStorage on initialization
const loadedCandidates = loadCandidates();

const initialState: InterviewState = {
  candidates: loadedCandidates,
  currentCandidate: null,
  questions: [],
  questionsGenerated: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
      state.currentCandidate = action.payload;
      saveCandidates(state.candidates);
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.questionsGenerated = true;
    },
    updateAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: string }>
    ) => {
      if (state.currentCandidate) {
        state.currentCandidate.answers[action.payload.questionIndex] =
          action.payload.answer;
      }
    },
    finishInterview: (
      state,
      action: PayloadAction<{ score: number; summary: string }>
    ) => {
      if (state.currentCandidate) {
        state.currentCandidate.score = action.payload.score;
        state.currentCandidate.summary = action.payload.summary;
        state.currentCandidate.completedAt = new Date().toISOString();
        
        // Update in candidates array
        const index = state.candidates.findIndex(
          c => c.id === state.currentCandidate!.id
        );
        if (index !== -1) {
          state.candidates[index] = state.currentCandidate;
        }
        saveCandidates(state.candidates);
      }
    },
    resetInterview: (state) => {
      state.currentCandidate = null;
      state.questions = [];
      state.questionsGenerated = false;
    },
    // New action to restore state from localStorage
    restoreInterviewState: (
      state,
      action: PayloadAction<{
        candidate: Candidate;
        questions: Question[];
        currentQuestionIndex: number;
      }>
    ) => {
      state.currentCandidate = action.payload.candidate;
      state.questions = action.payload.questions;
      state.questionsGenerated = true;
    },
  },
});

export const {
  addCandidate,
  setQuestions,
  updateAnswer,
  finishInterview,
  resetInterview,
  restoreInterviewState,
} = interviewSlice.actions;

export default interviewSlice.reducer;