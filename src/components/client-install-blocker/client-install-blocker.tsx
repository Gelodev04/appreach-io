'use client';

import { useEffect } from 'react';

export default function ClientInstallBlocker() {
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  return null;
}
