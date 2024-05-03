'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import HostsNewEditForm from '../hosts-new-edit-form';

// ----------------------------------------------------------------------

export default function HostsEditView() {
  const settings = useSettingsContext();
  const HOST = {
    name: 'outreachmagic',
    id: 'outreachmagic_CLLUz',
    timezone: 'America/New_York (-04:00)',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['Remove from spam', 'Scroll message', 'Click link'],
    hostCrypt: 'outreachmagic_abc123',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22outreachmagic_CLLUz%22%7D',
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add a new host"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Hosts',
            href: paths.dashboard.hosts.root,
          },
          { name: 'Edit host' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostsNewEditForm currentItem={HOST} />
    </Container>
  );
}
