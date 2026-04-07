import React, { useState } from 'react';
import { 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  MessageCircle,
  Sparkles,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function PlacementSupport() {
  const { user } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [guidance, setGuidance] = useState('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);

  const interestOptions = [
    'Software Development',
    'Data Science',
    'Machine Learning',
    'Web Development',
    'Mobile App Development',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Project Management',
    'Business Analysis',
    'Quality Assurance',
    'Research & Development',
    'Consulting',
    'Entrepreneurship'
  ];

  const resources = [
    {
      title: 'Resume Building Workshop',
      description: 'Learn to create compelling resumes that stand out to recruiters',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Interview Skills Training',
      description: 'Master both technical and behavioral interview techniques',
      icon: MessageCircle,
      color: 'green'
    },
    {
      title: 'Networking Events',
      description: 'Connect with industry professionals and alumni',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Industry Insights',
      description: 'Stay updated with the latest industry trends and requirements',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const departmentSpecificTips = {
    'Computer Science': [
      'Build a strong portfolio with diverse projects',
      'Contribute to open source projects',
      'Learn popular frameworks and libraries',
      'Practice coding problems regularly'
    ],
    'Information Technology': [
      'Gain hands-on experience with enterprise technologies',
      'Obtain relevant certifications (AWS, Azure, etc.)',
      'Understand business processes and IT solutions',
      'Develop problem-solving skills'
    ],
    'Electronics & Communication': [
      'Stay updated with emerging technologies like IoT and 5G',
      'Develop both hardware and software skills',
      'Work on practical projects and prototypes',
      'Consider specializing in a specific domain'
    ],
    'Mechanical Engineering': [
      'Learn CAD/CAM software proficiently',
      'Understand manufacturing processes',
      'Gain experience with automation and robotics',
      'Develop project management skills'
    ]
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGetGuidance = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest area');
      return;
    }

    setLoadingGuidance(true);
    try {
      // TODO: Implement AI guidance API call to backend
      setGuidance('AI-powered career guidance will be available once the backend endpoint is implemented.');
      setShowGuidance(true);
    } catch (error) {
      console.error('Error generating guidance:', error);
      alert('Failed to generate guidance. Please try again.');
    } finally {
      setLoadingGuidance(false);
    }
  };

  const currentDepartmentTips = departmentSpecificTips[user?.department as keyof typeof departmentSpecificTips] || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Placement Support</h1>
        <p className="text-indigo-100">
          Get personalized guidance for your career journey in {user?.department}
        </p>
      </div>

      {/* AI-Powered Guidance Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Career Guidance</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Select your areas of interest to get personalized career guidance and recommendations.
        </p>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Select Your Interests:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {interestOptions.map(interest => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  selectedInterests.includes(interest)
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetGuidance}
          disabled={loadingGuidance || selectedInterests.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loadingGuidance ? 'Generating Guidance...' : 'Get AI Guidance'}</span>
        </button>

        {showGuidance && guidance && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 text-purple-600 mr-2" />
              Personalized Career Guidance
            </h4>
            <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {guidance}
            </div>
          </div>
        )}
      </div>

      {/* Department-Specific Tips */}
      {currentDepartmentTips.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            {user?.department} Career Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDepartmentTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[resource.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm">{resource.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors">
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Download Resume Template</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Join Alumni Network</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Book 1:1 Counseling</span>
          </button>
        </div>
      </div>
    </div>
  );
}