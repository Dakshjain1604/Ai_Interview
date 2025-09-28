// src/redux/interviewSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import  type {PayloadAction} from "@reduxjs/toolkit"
 
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
}

interface InterviewState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  questions: Question[];
  questionsGenerated: boolean;
}

const initialState: InterviewState = {
  candidates: [],
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
      }
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.questionsGenerated = true;
    },resetInterview: (state) => {
      state.questions = [];
      state.questionsGenerated = false;
      state.currentCandidate = null;
    },
  },
});

export const { 
  addCandidate, 
  updateAnswer, 
  finishInterview, 
  setQuestions, 
  resetInterview 
} = interviewSlice.actions;

export default interviewSlice.reducer;
