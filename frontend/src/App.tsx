import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import AuthForm from './components/Auth/AuthForm.tsx';
import StudentPortal from './components/Student/StudentPortal.tsx';
import AdminPortal from './components/Admin/AdminPortal';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user.role === 'admin' ? '/admin' : '/students'} replace />} />
      <Route path="/students/*" element={user.role === 'student' ? <StudentPortal /> : <Navigate to="/admin" replace />} />
      <Route path="/admin/*" element={user.role === 'admin' ? <AdminPortal /> : <Navigate to="/students" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;