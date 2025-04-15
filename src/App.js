import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import AlertManagement from './pages/AlertManagement';
import GBVReports from './pages/GBVReports';
import HealthMonitoring from './pages/HealthMonitoring';
import FireDrillLogs from './pages/FireDrillLogs';
import SecurityPatrol from './pages/SecurityPatrol';
import Notifications from './pages/Notifications';
import ChatbotEditor from './pages/ChatbotEditor';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/alerts" element={<AlertManagement />} />
              <Route path="/gbv-reports" element={<GBVReports />} />
              <Route path="/health-monitoring" element={<HealthMonitoring />} />
              <Route path="/fire-drills" element={<FireDrillLogs />} />
              <Route path="/security-patrol" element={<SecurityPatrol />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/chatbot" element={<ChatbotEditor />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
