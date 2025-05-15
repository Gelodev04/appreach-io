'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isTrialExpired = useIsTrialExpired();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    } else {
      router.replace(isTrialExpired ? '/billing' : PATH_AFTER_LOGIN);
    }
  }, [status, session, isTrialExpired, router]);

  return null;
}
