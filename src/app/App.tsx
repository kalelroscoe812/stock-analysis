import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import { UserDashboard } from './components/UserDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}