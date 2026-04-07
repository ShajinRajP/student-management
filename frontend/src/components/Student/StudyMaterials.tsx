import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Search,
  Sparkles,
  Clock,
  Eye
} from 'lucide-react';
import { studyMaterialsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface StudyMaterial {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  department: string;
  uploadedBy: {
    fullName: string;
    email: string;
  };
  aiSummary?: string;
  downloadCount: number;
  tags: string[];
  createdAt: string;
}

export default function StudyMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user]);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      const response = await studyMaterialsAPI.getAll();
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;
    
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  };

  const handleGenerateSummary = async (material: StudyMaterial) => {
    if (material.aiSummary) return;
    
    setGeneratingSummary(true);
    try {
      const response = await studyMaterialsAPI.generateSummary(material._id);
      
      if (response.data.success) {
        // Update the material in the local state
        setMaterials(prev => prev.map(m => 
          m._id === material._id 
            ? { ...m, aiSummary: response.data.data.aiSummary }
            : m
        ));
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate summary. Please try again.';
      alert(errorMessage);
    } finally {
      setGeneratingSummary(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-600">Access and summarize your study resources</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <div key={material._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMaterial(material)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
            {material.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(material.createdAt)}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {material.fileName.split('.').pop()?.toUpperCase()}
              </span>
            </div>

            {material.aiSummary ? (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-700">AI Summary</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{material.aiSummary}</p>
              </div>
            ) : (
              <button
                onClick={() => handleGenerateSummary(material)}
                disabled={generatingSummary}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generatingSummary ? 'Generating...' : 'Generate AI Summary'}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study materials found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Study materials will appear here once uploaded by admins'}
          </p>
        </div>
      )}

      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h2>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {selectedMaterial.description && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedMaterial.description}</p>
                </div>
              )}

              {selectedMaterial.aiSummary && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                    AI Summary
                  </h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-700">{selectedMaterial.aiSummary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  <p>File: {selectedMaterial.fileName}</p>
                  <p>Added: {formatDate(selectedMaterial.createdAt)}</p>
                </div>
                <a
                  href={`http://localhost:5000${selectedMaterial.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}