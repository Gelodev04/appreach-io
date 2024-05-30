'use client';

import { GuestGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    // <AuthGuard>
    <GuestGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </GuestGuard>
    // </AuthGuard>
  );
}
