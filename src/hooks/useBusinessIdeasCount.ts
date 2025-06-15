'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface BusinessIdeasCount {
  totalIdeas: number;
  savedIdeas: number;
}

export function useBusinessIdeasCount() {
  const [counts, setCounts] = useState<BusinessIdeasCount>({ totalIdeas: 0, savedIdeas: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  const fetchCounts = async (isMounted = true) => {
    if (!isMounted) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get total ideas count
      const { count: totalCount, error: totalError } = await supabase
        .from('business_ideas')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get user data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // If no user, just return total count
      if (!user) {
        if (isMounted) {
          setCounts({
            totalIdeas: totalCount || 0,
            savedIdeas: 0
          });
        }
        return;
      }

      // Get saved ideas count
      const { count: savedCount, error: savedError } = await supabase
        .from('saved_ideas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (savedError) throw savedError;

      if (isMounted) {
        setCounts({
          totalIdeas: totalCount || 0,
          savedIdeas: savedCount || 0
        });
      }
    } catch (err) {
      console.error('Error fetching counts:', err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Failed to fetch counts'));
        // Set default values on error
        setCounts({ totalIdeas: 0, savedIdeas: 0 });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchCounts(mounted);
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = () => {
    fetchCounts();
  };

  return { ...counts, isLoading, error, refresh };
}
