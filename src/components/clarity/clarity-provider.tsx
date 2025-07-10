'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

interface ClarityProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export default function ClarityProvider({ projectId, children }: ClarityProviderProps) {
  useEffect(() => {
    Clarity.init(projectId);
  }, [projectId]);

  return <>{children}</>;
}
