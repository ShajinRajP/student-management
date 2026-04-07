import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Play, 
  Pause, 
  RotateCcw, 
  Award,
  Clock,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MockInterviewType {
  id: string;
  student_id: string;
  job_role: string;
  questions: any[];
  answers: any[];
  ai_feedback?: string;
  score?: number;
  completed_at?: string;
  created_at: string;
}

export default function MockInterview() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<MockInterviewType[]>([]);
  const [currentInterview, setCurrentInterview] = useState<MockInterviewType | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [showStartForm, setShowStartForm] = useState(false);

  const jobRoles = [
    'Software Developer',
    'Data Scientist',
    'Product Manager',
    'Business Analyst',
    'UI/UX Designer',
    'DevOps Engineer',
    'Quality Assurance Engineer',
    'Project Manager',
    'Marketing Manager',
    'Sales Representative',
    'Research Analyst',
    'Consultant'
  ];

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      // TODO: Implement mock interviews API when backend endpoint is ready
      setInterviews([]);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewInterview = async () => {
    if (!jobRole.trim()) {
      alert('Please select a job role');
      return;
    }

    setGeneratingQuestions(true);
    try {
      // TODO: Implement AI question generation API call to backend
      const questions = [
        'Tell me about yourself and your background.',
        'Why are you interested in this role?',
        'What are your greatest strengths?',
        'Describe a challenging project you worked on.',
        'Where do you see yourself in 5 years?'
      ];
      
      const mockInterview = {
        id: Date.now().toString(),
        student_id: user?.id || '',
        job_role: jobRole,
        questions: questions,
        answers: [],
        created_at: new Date().toISOString()
      };

      setCurrentInterview(mockInterview);
      setAnswers(new Array(questions.length).fill(''));
      setCurrentQuestionIndex(0);
      setCurrentAnswer('');
      setIsActive(true);
      setShowStartForm(false);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const nextQuestion = () => {
    if (currentInterview && currentQuestionIndex < currentInterview.questions.length - 1) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentAnswer('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const finishInterview = async () => {
    if (!currentInterview) return;

    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = currentAnswer;

    setGeneratingFeedback(true);
    try {
      // TODO: Implement AI feedback generation API call to backend
      const feedback = 'Great job on your interview! Your answers showed good preparation and enthusiasm.';
      const score = 85;

      console.log('Saving interview results:', {
        answers: finalAnswers,
        ai_feedback: feedback,
        score: score,
        completed_at: new Date().toISOString()
      });

      await fetchInterviews();
      setIsActive(false);
      setCurrentInterview(null);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer('');
    } catch (error) {
      console.error('Error finishing interview:', error);
      alert('Failed to finish interview. Please try again.');
    } finally {
      setGeneratingFeedback(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isActive && currentInterview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Mock Interview - {currentInterview.job_role}</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <span>Question {currentQuestionIndex + 1} of {currentInterview.questions.length}</span>
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentInterview.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question {currentQuestionIndex + 1}:
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentInterview.questions[currentQuestionIndex]}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your answer here..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Record Answer'}</span>
              </button>
            </div>

            <div className="flex space-x-3">
              {currentQuestionIndex < currentInterview.questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={finishInterview}
                  disabled={generatingFeedback}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generatingFeedback ? 'Generating Feedback...' : 'Finish Interview'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
          <p className="text-gray-600">Practice interviews with AI-powered feedback</p>
        </div>
        <button
          onClick={() => setShowStartForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Start New Interview</span>
        </button>
      </div>

      {/* Interview History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview History</h2>
        <div className="space-y-4">
          {interviews.map(interview => (
            <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{interview.job_role}</h3>
                  <p className="text-sm text-gray-600">
                    {interview.completed_at 
                      ? `Completed on ${formatDate(interview.completed_at)}`
                      : 'In Progress'
                    }
                  </p>
                </div>
                {interview.score && (
                  <div className="flex items-center space-x-2">
                    <Award className={`w-5 h-5 ${
                      interview.score >= 80 ? 'text-green-600' :
                      interview.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <span className={`font-semibold ${
                      interview.score >= 80 ? 'text-green-600' :
                      interview.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {interview.score}/100
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>{interview.questions.length} questions</p>
              </div>

              {interview.ai_feedback && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                    AI Feedback
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {interview.ai_feedback}
                  </p>
                </div>
              )}
            </div>
          ))}

          {interviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-600">Start your first mock interview to get AI-powered feedback</p>
            </div>
          )}
        </div>
      </div>

      {/* Start Interview Modal */}
      {showStartForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Start Mock Interview</h2>
                <button
                  onClick={() => setShowStartForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Job Role
                  </label>
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a role...</option>
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 8-10 tailored interview questions</li>
                    <li>• Mix of technical and behavioral questions</li>
                    <li>• AI-powered feedback and scoring</li>
                    <li>• Personalized improvement suggestions</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowStartForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startNewInterview}
                    disabled={!jobRole.trim() || generatingQuestions}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generatingQuestions ? 'Preparing Questions...' : 'Start Interview'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}