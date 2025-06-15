'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { BusinessIdea } from '@/types';

interface AppState {
  savedIdeas: BusinessIdea[];
  filters: {
    subreddit: string;
    sortBy: string;
  };
  theme: 'light' | 'dark';
}

type AppAction =
  | { type: 'SAVE_IDEA'; payload: BusinessIdea }
  | { type: 'REMOVE_SAVED_IDEA'; payload: number }
  | { type: 'UPDATE_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  savedIdeas: [],
  filters: {
    subreddit: 'all',
    sortBy: 'newest'
  },
  theme: 'light'
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SAVE_IDEA':
      return {
        ...state,
        savedIdeas: [...state.savedIdeas, action.payload]
      };

    case 'REMOVE_SAVED_IDEA':
      return {
        ...state,
        savedIdeas: state.savedIdeas.filter(idea => idea.id !== action.payload)
      };

    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}