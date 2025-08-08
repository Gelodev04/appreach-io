'use client';

import { useEffect } from 'react';
// import Clarity from '@microsoft/clarity';
import { env } from 'src/data/env/client';

interface ClarityProviderProps {
  children: React.ReactNode;
}

export default function ClarityProvider({ children }: ClarityProviderProps) {
  const clarityProjectId = env.NEXT_PUBLIC_CLARITY_PROJECT_ID!;

  useEffect(() => {
    // Clarity.init(clarityProjectId);
  }, [clarityProjectId]);

  return <>{children}</>;
}
