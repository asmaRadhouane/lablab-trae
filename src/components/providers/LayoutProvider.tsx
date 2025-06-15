'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/contexts/AppContext';

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}