'use client';

import { useState, useCallback, useEffect } from 'react';
import { UseBusinessIdeasOptions } from '@/hooks/useBusinessIdeas';

interface FilterBarProps {
  onFilterChange?: (filters: UseBusinessIdeasOptions) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'created_at'>('created_at');

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.({
        searchQuery: searchQuery || undefined,
        category: category || undefined,
        sortBy
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category, sortBy, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="tech">Technology</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="saas">SaaS</option>
            <option value="marketplace">Marketplace</option>
            <option value="consumer">Consumer</option>
            <option value="enterprise">Enterprise</option>
            <option value="mobile">Mobile</option>
            <option value="other">Other</option>
          </select>

          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'upvotes' | 'created_at')}
          >
            <option value="created_at">Newest First</option>
            <option value="upvotes">Most Upvotes</option>
          </select>
        </div>
      </div>
    </div>
  );
}