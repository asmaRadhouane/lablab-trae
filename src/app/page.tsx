'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import IdeaCard from '@/components/IdeaCard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import LoadingState from '@/components/LoadingState';
import SavedIdeasView from '@/components/SavedIdeasView';

import { BusinessIdea } from '@/types';

import { useBusinessIdeas } from '@/hooks/useBusinessIdeas';

export default function Home() {
  const [activeTab, setActiveTab] = useState('discover');
  const { 
    ideas, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    refresh, 
    updateOptions 
  } = useBusinessIdeas();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Error loading ideas</h3>
          <p className="mt-2 text-sm text-gray-500">{error.message}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'discover':
        return (
          <div className="space-y-6">
            <FilterBar onFilterChange={updateOptions} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  {...idea}
                />
              ))}
            </div>
            {isLoading && (
              <div className="col-span-full flex justify-center py-4">
                <LoadingState />
              </div>
            )}
            {!isLoading && !ideas.length && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No ideas found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
            {hasMore && !isLoading && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => loadMore()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        );
      case 'saved':
        return <SavedIdeasView />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onTabChange={handleTabChange} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
