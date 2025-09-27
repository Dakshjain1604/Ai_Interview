import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import DashBoard from './pages/DashBoard'
import Chat from './pages/Chat'
import LandingPage from './pages/LandingPage'
import UploadResume from './pages/UploadResume'

function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Upload" element={<UploadResume />} />
      <Route path="/DashBoard" element={<DashBoard/>} />
      <Route path="/Chat" element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
