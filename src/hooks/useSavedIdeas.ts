'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useSavedIdeas() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const saveIdea = async (ideaId: number) => {
    if (isLoading) return { success: false, error: new Error('Operation in progress') };
    
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if already saved to prevent duplicates
      const existingSave = await checkIfSaved(ideaId);
      if (existingSave) {
        return { success: true, error: null };
      }

      const { error } = await supabase
        .from('saved_ideas')
        .insert({
          idea_id: ideaId,
          user_id: user.id,
        });
        
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error saving idea:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const unsaveIdea = async (ideaId: number) => {
    if (isLoading) return { success: false, error: new Error('Operation in progress') };

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .match({ idea_id: ideaId, user_id: user.id });
        
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error unsaving idea:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async (ideaId: number): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('saved_ideas')
        .select('id')
        .match({ idea_id: ideaId, user_id: user.id })
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if idea is saved:', error);
      return false;
    }
  };

  return { saveIdea, unsaveIdea, checkIfSaved, isLoading };
}
