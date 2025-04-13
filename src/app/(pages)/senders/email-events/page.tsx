import { Container } from '@mui/material';
import { getConfigDropdownOptions } from 'src/services/db/config';
import { getSenderAccountByHostIdsAndType } from 'src/services/db/sender-accounts';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { mapDisplayValueToLabelValue } from 'src/utils';
import { EmailEventsHeader } from './_components/email-events-header';
import { EmailEventsTable } from './_components/email-events-table';

export const metadata = {
  title: 'Email Events | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const EmailEventsPage = async () => {
  const rows = await getSenderAccountByHostIdsAndType({ type: 'email' });
  const { allHosts: senderProfiles } = await getSenderProfiles();
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });
  const emailServerOptions = await getConfigDropdownOptions({ key: 'email_server_options' });
  const emailResellerOptions = await getConfigDropdownOptions({ key: 'email_reseller_options' });

  const platformOptionsMapped = mapDisplayValueToLabelValue(platformOptions);
  const emailServerOptionsMapped = mapDisplayValueToLabelValue(emailServerOptions);
  const emailResellerOptionsMapped = mapDisplayValueToLabelValue(emailResellerOptions);
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <EmailEventsHeader />

      <EmailEventsTable
        rows={rows}
        platFormOptions={platformOptionsMapped}
        hostOptions={senderProfiles}
        emailServerOptions={emailServerOptionsMapped}
        emailResellerOptions={emailResellerOptionsMapped}
      />
    </Container>
  );
};

export default EmailEventsPage;
