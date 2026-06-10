import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DuelPage from './pages/DuelPage';
import SubmissionsPage from './pages/SubmissionsPage';
import RoomPage from './pages/RoomPage';
import ResultsPage from './pages/ResultsPage';
import PracticePage from './pages/PracticePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/auth"     element={<AuthPage />} />
          <Route path="/practice" element={<PracticePage />} />

          {/* Protected routes — must be signed in */}
          {/* Match results — reads from matches/{matchId} collection */}
          <Route
            path="/match/:matchId/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          {/* Legacy results route — rooms no longer hold result data; redirect home */}
          <Route path="/room/:roomId/results" element={<Navigate to="/" replace />} />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/duel/:roomId"
            element={
              <ProtectedRoute>
                <DuelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/duel"
            element={
              <ProtectedRoute>
                <DuelPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
