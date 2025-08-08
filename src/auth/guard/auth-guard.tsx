import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getUserSettings } from 'src/services/db/user-settings';
import { useUsersPlanStore } from 'src/store/user-setting';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  nextAuth: paths.auth.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { status } = useSession();

  return <>{status === 'loading' ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const setUserPlan = useUsersPlanStore((state) => state.setUserPlan);
  const authenticated = status === 'authenticated' || status === 'loading';
  const [checked, setChecked] = useState(false);

  const check = useCallback(async () => {
    if (!authenticated) {
      const loginPath = loginPaths.nextAuth;
      const href = `${loginPath}`;
      router.replace(href);
    } else {
      setChecked(true);
      const {
        plan,
        appLogin: { username },
      } = await getUserSettings({
        plan: true,
        appLogin: { select: { username: true } },
      });
      // added the user name in inspectlet
      // window.__insp.push(['identify', username]);
      if (!plan) {
        console.log('No plan found.');
        return undefined;
      }
      setUserPlan({ ...plan });
    }
  }, [authenticated, router, setUserPlan]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
