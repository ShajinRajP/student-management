import React from 'react';
import { 
  BookOpen, 
  Briefcase, 
  User, 
  DollarSign, 
  MessageSquare, 
  Upload,
  Users,
  LogOut,
  GraduationCap,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'placement', label: 'Placement Support', icon: Target },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'materials', label: 'Manage Materials', icon: BookOpen },
    { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    const basePath = user?.role === 'admin' ? '/admin' : '/students';
    navigate(`${basePath}/${tab}`);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">AI Study Toolkit</h1>
        <p className="text-blue-200 text-sm">
          {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname.includes(item.id)
                  ? 'bg-white bg-opacity-20 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>


      <div className="absolute bottom-4 left-4 right-4">
        
          <div className="mb-3">
            <p className="text-sm text-blue-200">Welcome back,</p>
            <p className="font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-blue-300">{user?.department}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-blue-100 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      
    </div>
  );
}