import { BusinessIdea } from '@/types';
import { useSavedIdeas } from '@/hooks/useSavedIdeas';
import { useEffect, useState, useCallback } from 'react';
import IdeaDetailView from './IdeaDetailView';

type IdeaCardProps = BusinessIdea;

export default function IdeaCard({
  id,
  title,
  description,
  subreddit_name,
  upvotes,
  post_date,
  url,
  category,
  subreddit_subscribers,
  ...restOfIdea
}: IdeaCardProps) {
  const { saveIdea, unsaveIdea, checkIfSaved, isLoading: saveLoading } = useSavedIdeas();
  const [isSaved, setIsSaved] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Use useCallback to prevent re-creating this function on every render
  const checkSavedStatus = useCallback(async () => {
    try {
      setIsChecking(true);
      const saved = await checkIfSaved(id);
      setIsSaved(saved);
    } finally {
      setIsChecking(false);
    }
  }, [id, checkIfSaved]);

  // Only check saved status once on mount
  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  const handleSave = async () => {
    if (saveLoading || isSaved) return;
    
    try {
      const { success } = await saveIdea(id);
      if (success) setIsSaved(true);
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {category}
            </span>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p className="line-clamp-3">{description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>r/{subreddit_name}</span>
            {subreddit_subscribers && (
              <>
                <span>•</span>
                <span>{new Intl.NumberFormat().format(subreddit_subscribers)} subscribers</span>
              </>
            )}
            <span>•</span>
            <span>{upvotes ?? 0} upvotes</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={handleSave}
            disabled={saveLoading || isSaved}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isSaved 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            } ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saveLoading ? 'Loading...' : isSaved ? 'Saved' : 'Save Idea'}
          </button>
          <button 
            onClick={() => setShowDetail(true)}
            className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Detail View Modal */}
      {showDetail && (
        <IdeaDetailView 
          idea={{ id, title, description, subreddit_name, upvotes, post_date, url, category, subreddit_subscribers, ...restOfIdea }} 
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
}