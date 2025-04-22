import { Container } from '@mui/material';
import { getHostById } from 'src/services/db/hosts';
import NotificationForm from './_components/notification-form';
import { NotificationsHeader } from './_components/notifications-header';

export const metadata = {
  title: 'Edit notification settings | Outreach Magic',
};

export default async function NotificationEditPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const host = await getHostById(hostId);

  return (
    <Container maxWidth="lg">
      <NotificationsHeader />

      <NotificationForm currentItem={host} />
    </Container>
  );
}
