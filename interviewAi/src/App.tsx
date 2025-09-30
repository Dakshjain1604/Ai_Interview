import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// lazy imports
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Interviewee = lazy(() => import('./pages/Interviewee'));
const Interviewer = lazy(() => import('./pages/Interviewer'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interviewee" element={<Interviewee />} />
          <Route path="/interviewer" element={<Interviewer />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
