import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
import Script from 'next/script';
import { useCheckUserPlan } from 'src/hooks/api/plan';
import { env } from 'src/data/env';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading: authLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const { status, data } = useSession();
  const { plan } = useCheckUserPlan();
  const user = data?.user;

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const trialExpired = searchParams.get('trial_expired');

  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoading = authLoading || status === 'loading';

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Handle redirection based on plan status

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

    if (
      plan?.status === 'trial_expired' &&
      (!pathname.startsWith('/auth/') || (pathname.startsWith('/subscription') && !trialExpired))
    ) {
      router.push('/subscription/?trial_expired=true');
      setIsRedirecting(false);
    }
  }, [isLoading, isAuthenticated, returnTo, plan?.status, pathname, router, trialExpired]);

  if (isLoading || isRedirecting) {
    return <SplashScreen />;
  }

  return (
    <>
      {user ? (
        <>
          <Script strategy="afterInteractive">
            {`
              window.salesmateSettings = {
                workspace_id: "${env.NEXT_PUBLIC_SALESMATE_WORKSPACE_ID}",
                app_key: "${env.NEXT_PUBLIC_SALESMATE_APP_KEY}",
                tenant_id: "${env.NEXT_PUBLIC_SALESMATE_TENANT_ID}",
              };
              if (window.SALESMATE) {
                window.SALESMATE.login({
                  user_id: "${user?.id}",
                  email: "${user?.email}",
                  first_name: "${user?.firstName}",
                  last_name: "${user?.lastName}",
                  phone: "${user?.phone}",
                });
               }
            `}
          </Script>
          <Script strategy="afterInteractive" id="salesmate-widget-loader">
            {`
              !function(e, t, a, i, d, n, o) {
                e.Widget = i;
                e[i] = e[i] || function() {
                  (e[i].q = e[i].q || []).push(arguments)
                },
                n = t.createElement(a), o = t.getElementsByTagName(a)[0],
                n.id = i, n.src = d,
                window._salesmate_widget_script_url = d,
                n.async = 1,
                o.parentNode.insertBefore(n, o)
              }(window, document, "script", "loadwidget", "https://inboxdaddy.salesmate.io/messenger-platform/messenger-platform-main.js");
              loadwidget("init", {});
              loadwidget("load_widget", "Widget Loading...!");
            `}
          </Script>
        </>
      ) : null}
      {children}
    </>
  );
}
