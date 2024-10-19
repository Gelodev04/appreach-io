import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading: authLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoading = authLoading || status === 'loading';

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      setIsRedirecting(true);
      if (returnTo) {
        router.replace(returnTo);
      } else if (pathname.startsWith('/auth/')) {
        router.replace('/');
      } else {
        // If the user is authenticated and not on an auth page, no need to redirect
        setIsRedirecting(false);
      }
    }
  }, [isLoading, isAuthenticated, router, returnTo, pathname]);

  if (isLoading || isRedirecting) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
