'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useBusinessIdeasCount } from '@/hooks/useBusinessIdeasCount';

interface Tab {
  id: string;
  name: string;
  count?: number;
}

interface NavigationProps {
  onTabChange: (tabId: string) => void;
}

export default function Navigation({ onTabChange }: NavigationProps) {
  const [activeTab, setActiveTab] = useState('discover');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const { totalIdeas, savedIdeas, isLoading, error } = useBusinessIdeasCount();

  const tabs: Tab[] = [
    { id: 'discover', name: 'Discover Ideas', count: isLoading ? undefined : totalIdeas },
    { id: 'saved', name: 'Saved Ideas' },
    { id: 'analytics', name: 'Analytics' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        return;
      }

      // Close the profile menu
      setIsProfileOpen(false);
      // Redirect to auth page
      router.push('/auth');
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu')) {
          setIsProfileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
                {tab.count !== undefined && !isLoading && (
                  <span
                    className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
                {isLoading && tab.count !== undefined && (
                  <span className="ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100">
                    •••
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="relative profile-menu">
            <button
              type="button"
              className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}