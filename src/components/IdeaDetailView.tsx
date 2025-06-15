import { BusinessIdea } from '@/types';
import { useSavedIdeas } from '@/hooks/useSavedIdeas';
import { useEffect, useState } from 'react';

interface IdeaDetailViewProps {
  idea: BusinessIdea;
  onClose: () => void;
}

export default function IdeaDetailView({ idea, onClose }: IdeaDetailViewProps) {
  const { saveIdea, unsaveIdea, checkIfSaved, isLoading } = useSavedIdeas();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkSavedStatus = async () => {
      const saved = await checkIfSaved(idea.id);
      if (mounted) {
        setIsSaved(saved);
      }
    };
    checkSavedStatus();
    return () => { mounted = false; };
  }, [idea.id]);
  const handleSave = async () => {
    if (isLoading || isSaved) return;
    try {
      const { success } = await saveIdea(idea.id);
      if (success) setIsSaved(true);
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };
  const getDate = (dateStr: string | null): string => {
    return dateStr || 'No date';
  };

  // Close modal when clicking outside or pressing ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold text-gray-900">{idea.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category and Meta Info */}
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
            {idea.category && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                {idea.category}
              </span>
            )}
            <span>Posted in r/{idea.subreddit_name}</span>
            {idea.subreddit_subscribers && (
              <span>{new Intl.NumberFormat().format(idea.subreddit_subscribers)} subscribers</span>
            )}
            <span>{idea.upvotes ?? 0} upvotes</span>
            <span>{getDate(idea.post_date)}</span>
          </div>          {/* Content Section */}
          <div className="bg-gray-50 rounded-lg p-6 prose max-w-none">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Business Opportunity</h3>
              <p className="text-gray-600">{idea.description}</p>
            </div>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={handleSave}
                disabled={isLoading}                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSaved 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading...' : isSaved ? 'Saved' : 'Save Idea'}
              </button>
              {idea.url && (
                <a
                  href={idea.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  View Source
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
