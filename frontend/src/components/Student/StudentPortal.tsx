import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

// Student Components
import StudentDashboard from './Dashboard';
import StudyMaterials from './StudyMaterials';
import JobOpportunities from './JobOpportunities';
import PlacementSupport from './PlacementSupport';
import BudgetTracker from './BudgetTracker';
import MockInterview from './MockInterview';
import StudentProfile from './Profile';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/students/dashboard" replace />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/jobs" element={<JobOpportunities />} />
          <Route path="/placement" element={<PlacementSupport />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </div>
  );
}