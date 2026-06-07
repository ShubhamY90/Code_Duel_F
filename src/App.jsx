import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DuelPage from './pages/DuelPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/duel/:problemId" element={<DuelPage />} />
        <Route path="/duel" element={<DuelPage />} />
      </Routes>
    </BrowserRouter>
  );
}


