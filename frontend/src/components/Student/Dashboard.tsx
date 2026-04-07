import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { studyMaterialsAPI } from '../../lib/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    materials: 0,
    jobs: 0,
    budget: 0,
    interviews: 0
  });
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch materials
      const response = await studyMaterialsAPI.getAll();
      const materials = response.data.data || [];

      setStats({
        materials: materials.length,
        jobs: 0, // Placeholder
        budget: 0, // Placeholder
        interviews: 0 // Placeholder
      });

      setRecentJobs([]);
      setRecentMaterials(materials.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-blue-100">
          {user?.department} • Track your academic and placement journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Materials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.materials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Job Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Balance</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.budget.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mock Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Opportunities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Opportunities</h3>
            <Briefcase className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.position}</h4>
                      <p className="text-sm text-gray-600">{job.company_name}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          job.type === 'on-campus' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Deadline: {formatDate(job.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No job opportunities yet</p>
            )}
          </div>
        </div>

        {/* Recent Study Materials */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Study Materials</h3>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentMaterials.length > 0 ? (
              recentMaterials.map(material => (
                <div key={material.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900">{material.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Added {formatDate(material.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No study materials yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}