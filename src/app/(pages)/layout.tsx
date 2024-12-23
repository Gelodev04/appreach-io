'use client';

import { AuthGuard, GuestGuard } from 'src/auth/guard';
import { TourGuide } from 'src/components/tour';

import DashboardLayout from 'src/layouts/dashboard';
import { useTourDialogStore } from 'src/store/tour-dialog';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { start } = useTourDialogStore((state) => state);

  return (
    <AuthGuard>
      <GuestGuard>
        <DashboardLayout>
          {start && <TourGuide />}
          {children}
        </DashboardLayout>
      </GuestGuard>
    </AuthGuard>
  );
}
