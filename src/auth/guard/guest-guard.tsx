import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const returnTo = searchParams.get('returnTo') || paths.dashboard.root;
  const returnTo = searchParams.get('returnTo');
  const { status } = useSession();
  const authenticated = status === 'authenticated' || status === 'loading';

  const check = useCallback(() => {
    if (authenticated && returnTo) {
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
