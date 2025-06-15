export const SUBREDDITS = [
  'r/smallbusiness',
  'r/startups',
  'r/growmybusiness'
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'upvotes', label: 'Most Upvotes' },
  { value: 'comments', label: 'Most Comments' }
] as const;

export const ANALYTICS_REFRESH_INTERVAL = 30000; // 30 seconds

export const IDEA_FETCH_LIMIT = 20;

export const API_ENDPOINTS = {
  ideas: '/api/ideas',
  analytics: '/api/analytics',
  saved: '/api/saved-ideas'
} as const;