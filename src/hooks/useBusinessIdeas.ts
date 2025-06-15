'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { BusinessIdea } from '@/types';

const ITEMS_PER_PAGE = 10;

export interface UseBusinessIdeasOptions {
  category?: string;
  sortBy?: 'upvotes' | 'created_at';
  subreddit?: string;
  searchQuery?: string;
  limit?: number;
}

interface UseBusinessIdeasReturn {
  ideas: BusinessIdea[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  updateOptions: (newOptions: UseBusinessIdeasOptions) => void;
}

export function useBusinessIdeas(initialOptions?: UseBusinessIdeasOptions): UseBusinessIdeasReturn {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<UseBusinessIdeasOptions | undefined>(initialOptions);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  
  const lastFetchTime = useRef(0);
  const optionsRef = useRef(options);
  const pageRef = useRef(page);
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const supabase = createClientComponentClient();

  // Update refs when state changes
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchIdeas = useCallback(async (fetchOptions?: UseBusinessIdeasOptions, reset = false): Promise<void> => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Prevent concurrent fetches
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping');
      return;
    }

    try {
      console.log('Fetching ideas:', { reset, page: pageRef.current, currentCount: ideas.length });
      setIsLoading(true);
      fetchingRef.current = true;
      setError(null);
      
      // Reset pagination if needed
      if (reset) {
        setIdeas([]);
        setPage(1);
        pageRef.current = 1;
        setTotalCount(null);
      }

      const currentOptions = fetchOptions || optionsRef.current;
      const currentPage = pageRef.current;
      
      const limit = currentOptions?.limit || ITEMS_PER_PAGE;
      const from = reset ? 0 : (currentPage - 1) * limit;

      // Get total count if needed
      if (totalCount === null || reset) {
        let countQuery = supabase
          .from('business_ideas')
          .select('*', { count: 'exact', head: true });

        if (currentOptions?.category) {
          countQuery = countQuery.eq('category', currentOptions.category);
        }
        
        if (currentOptions?.subreddit) {
          countQuery = countQuery.eq('subreddit_name', currentOptions.subreddit);
        }

        if (currentOptions?.searchQuery) {
          countQuery = countQuery.or(`title.ilike.%${currentOptions.searchQuery}%,description.ilike.%${currentOptions.searchQuery}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
          throw new Error(countError.message);
        }

        console.log('Total count:', count);
        setTotalCount(count || 0);

        if (!count) {
          setHasMore(false);
          setIdeas([]);
          return;
        }
      }

      if (totalCount !== null && from >= totalCount) {
        console.log('No more data to load');
        setHasMore(false);
        return;
      }

      const to = from + limit - 1;

      let query = supabase
        .from('business_ideas')
        .select('*')
        .range(from, to);

      if (currentOptions?.category) {
        query = query.eq('category', currentOptions.category);
      }
      
      if (currentOptions?.subreddit) {
        query = query.eq('subreddit_name', currentOptions.subreddit);
      }

      if (currentOptions?.searchQuery) {
        query = query.or(`title.ilike.%${currentOptions.searchQuery}%,description.ilike.%${currentOptions.searchQuery}%`);
      }

      if (currentOptions?.sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (currentOptions?.sortBy === 'upvotes') {
        query = query.order('upvotes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      const newIdeas = data as BusinessIdea[];
      
      setIdeas(prev => {
        const updatedIdeas = reset ? newIdeas : [...prev, ...newIdeas];
        return updatedIdeas;
      });
      
      const hasMoreItems = newIdeas.length === limit && 
        (totalCount === null || (reset ? newIdeas.length : ideas.length + newIdeas.length) < totalCount);
      
      setHasMore(hasMoreItems);
      
      // Don't update options here as it causes a re-render cycle
      // setOptions(currentOptions);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      console.error('Error fetching ideas:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch ideas'));
      setHasMore(false);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [supabase, totalCount, ideas.length]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!isLoading && hasMore && !fetchingRef.current) {
      setPage(p => p + 1);
      await fetchIdeas();
    }
  }, [isLoading, hasMore, fetchIdeas]);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchIdeas(options, true);
  }, [options, fetchIdeas]);

  const updateOptions = useCallback((newOptions: UseBusinessIdeasOptions): void => {
    optionsRef.current = newOptions;
    pageRef.current = 1;
    setPage(1);
    setOptions(newOptions);
  }, []);

  // Initial fetch only on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (initialOptions) {
        updateOptions(initialOptions);
      } else {
        fetchIdeas(undefined, true);
      }
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ideas,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateOptions
  };
}