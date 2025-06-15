'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { BusinessIdea } from '@/types';

export function useSavedIdeasList() {
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  const fetchSavedIdeas = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');      // First fetch saved idea IDs
      const { data: savedIdeasData, error: savedIdeasError } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('user_id', user.id);

      if (savedIdeasError) throw savedIdeasError;
      if (!savedIdeasData) return;

      // Then fetch the actual business ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('business_ideas')
        .select('*')
        .in('id', savedIdeasData.map(item => item.idea_id));

      if (ideasError) throw ideasError;

      // Set the ideas directly since they already match the BusinessIdea type
      const ideas = ideasData || [];

      setSavedIdeas(ideas);
    } catch (err) {
      console.error('Error fetching saved ideas:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch saved ideas'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  const refresh = () => {
    fetchSavedIdeas();
  };

  return { savedIdeas, isLoading, error, refresh };
}
