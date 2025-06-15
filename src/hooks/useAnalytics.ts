'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface BusinessIdea {
  id: string;
  category: string | null;
  upvotes: number;
}

interface AnalyticsData {
  totalSavedIdeas: number;
  averageUpvotes: number;
  topCategory: {
    category: string;
    count: number;
  };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Get saved ideas with their full details
        const { data: savedIdeas, error: savedIdeasError } = await supabase
          .from('saved_ideas')
          .select(`
            *,
            business_ideas (
              id,
              category,
              subreddit_name,
              upvotes
            )
          `)
          .eq('user_id', user.id);

        if (savedIdeasError) throw savedIdeasError;

        // Process the data for analytics
        const ideas = savedIdeas.map(si => si.business_ideas);
          // Calculate metrics
        const categories = calculateCategoryBreakdown(ideas);
        const analytics: AnalyticsData = {
          totalSavedIdeas: ideas.length,
          averageUpvotes: calculateAverageUpvotes(ideas),
          topCategory: categories[0] || { category: 'N/A', count: 0 }
        };

        setData(analytics);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, isLoading, error };
}

// Helper functions for calculations
function calculateCategoryBreakdown(ideas: BusinessIdea[]): { category: string; count: number }[] {
  const categories = ideas.reduce((acc: { [key: string]: number }, idea) => {
    const category = idea.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function calculateAverageUpvotes(ideas: BusinessIdea[]): number {
  if (ideas.length === 0) return 0;
  const total = ideas.reduce((sum, idea) => sum + (idea.upvotes || 0), 0);
  return Math.round(total / ideas.length);
}
