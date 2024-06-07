import { useSession } from 'next-auth/react';

// import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// const loginPaths: Record<string, string> = {
//   nextAuth: paths.auth.login,
// };

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  // const router = useRouter();
  const { data: session, status } = useSession();
  // const authenticated = status === 'authenticated';
  console.log('session', session);
  console.log('status', status);

  // const { authenticated, method } = useAuthContext();

  // const [checked, setChecked] = useState(false);

  // const check = useCallback(() => {
  //   if (!authenticated) {
  //     const loginPath = loginPaths.nextAuth;

  //     const href = `${loginPath}`;

  //     router.replace(href);
  //   } else {
  //     setChecked(true);
  //   }
  // }, [authenticated, router]);

  // useEffect(() => {
  //   check();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [authenticated]);

  // if (!checked) {
  //   return null;
  // }

  return <>{children}</>;
}
