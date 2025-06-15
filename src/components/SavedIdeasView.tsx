'use client';

import { useSavedIdeas } from '@/hooks/useSavedIdeas';
import { useSavedIdeasList } from '@/hooks/useSavedIdeasList';
import { useBusinessIdeasCount } from '@/hooks/useBusinessIdeasCount';
import LoadingState from './LoadingState';
import { useEffect, useRef } from 'react';

export default function SavedIdeasView() {
  const { savedIdeas, isLoading: listLoading, error: listError, refresh: refreshList } = useSavedIdeasList();
  const { unsaveIdea } = useSavedIdeas();
  const { refresh: refreshCount } = useBusinessIdeasCount();
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const handleUnsave = async (ideaId: number) => {
    const { success } = await unsaveIdea(ideaId);
    if (success) {
      // Clear any pending refresh
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Debounce the refresh calls
      refreshTimeoutRef.current = setTimeout(() => {
        refreshList();
        refreshCount();
      }, 300);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  if (listLoading) {
    return <LoadingState />;
  }

  if (listError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600">Error loading saved ideas</h3>
        <p className="mt-2 text-sm text-gray-500">{listError.message}</p>
      </div>
    );
  }

  if (savedIdeas.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No saved ideas yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Ideas you save will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {savedIdeas.map((idea) => (
        <div key={idea.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
          <p className="mt-2 text-gray-600">{idea.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{idea.subreddit_name}</span>
            <span>{idea.upvotes} upvotes</span>
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleUnsave(idea.id)}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Remove from Saved
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
