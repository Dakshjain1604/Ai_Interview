import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Interviewee from './pages/Interviewee';
import Interviewer from './pages/Interviewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interviewee" element={<Interviewee />} />
        <Route path="/interviewer" element={<Interviewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;