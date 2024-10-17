import 'src/global.css';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from 'src/auth/context/jwt';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
import Script from 'next/script';

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Inbox Daddy',
  description:
    'Leverage our powerful email deliverability tools to ensure your emails land directly in the primary inbox. ',
  keywords: 'react,material,kit,application,dashboard,admin,template',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <Script strategy="afterInteractive">
        {`
          window.salesmateSettings = {
            workspace_id: "7ae0e152-56ea-4ad1-8a71-2a01a2142c2e",
            app_key: "e5fb65d0-8756-11ef-9245-856ae81ff140",
            tenant_id: "inboxdaddy.salesmate.io"
          };
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
        <SessionProvider>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    {children}
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
