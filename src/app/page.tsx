'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';

// ----------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();
  const isTrialExpired = useIsTrialExpired();

  useEffect(() => {
    router.push(isTrialExpired ? '/billing' : PATH_AFTER_LOGIN);
  }, [router, isTrialExpired]);

  return null;
}
