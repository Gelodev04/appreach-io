import 'src/global.css';

import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import { AuthProvider } from 'src/auth/context/jwt';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { ClarityProvider } from 'src/components/clarity';
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Outreach Magic',
  description:
    'Leverage our powerful email deliverability tools to ensure your emails land directly in the primary inbox. ',
  keywords: 'react,material,kit,application,dashboard,admin,template',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      media: '(prefers-color-scheme: light)',
      url: '/favicon/light/favicon-light.ico', // Light mode favicon
    },
    {
      rel: 'icon',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon/dark/favicon-dark.ico', // Dark mode favicon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      media: '(prefers-color-scheme: light)',
      url: '/favicon/light/favicon-16x16-light.png', // Light mode 16x16 icon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon/dark/favicon-16x16-dark.png', // Dark mode 16x16 icon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      media: '(prefers-color-scheme: light)',
      url: '/favicon/light/favicon-32x32-light.png', // Light mode 32x32 icon
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon/dark/favicon-32x32-dark.png', // Dark mode 32x32 icon
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      media: '(prefers-color-scheme: light)',
      url: '/favicon/light/apple-touch-icon-light.png', // Light mode Apple touch icon
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon/dark/apple-touch-icon-dark.png', // Dark mode Apple touch icon
    },
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
          {`    (function() {
window.__insp = window.__insp || [];
__insp.push(['wid', 360425918]);
var ldinsp = function(){
if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=360425918&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
setTimeout(ldinsp, 0);
})();`}
        </Script>
        <SessionProvider>
          <AuthProvider>
            <ClarityProvider>
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
                      {/* <ClientInstallBlocker /> */}
                      {children}
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </ClarityProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
