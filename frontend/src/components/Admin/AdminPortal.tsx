import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar.tsx';

// Admin Components
import AdminDashboard from './Dashboard.tsx';
import ManageMaterials from './ManageMaterials.tsx';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/materials" element={<ManageMaterials />} />
          <Route path="/jobs" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Jobs</h2>
              <p className="text-gray-600">Job management functionality coming soon...</p>
            </div>
          } />
          <Route path="/students" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Students</h2>
              <p className="text-gray-600">Student management functionality coming soon...</p>
            </div>
          } />
          <Route path="/profile" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Profile</h2>
              <p className="text-gray-600">Admin profile functionality coming soon...</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}