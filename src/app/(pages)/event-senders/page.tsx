import { Container } from '@mui/material';
import { getConfigDropdownOptions } from 'src/services/db/config';
import { getSenderAccountByHostIdsAndType } from 'src/services/db/sender-accounts';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { mapDisplayValueToLabelValue } from 'src/utils';
import { EventSendersHeader } from './_components/event-senders-header';
import { EventSendersTab } from './_components/event-senders-tab';

export const metadata = {
  title: 'Event Senders | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const EventSendersPage = async () => {
  const rows = await getSenderAccountByHostIdsAndType({});
  const { allHosts: senderProfiles } = await getSenderProfiles();
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });
  const emailServerOptions = await getConfigDropdownOptions({ key: 'email_server_options' });
  const emailResellerOptions = await getConfigDropdownOptions({ key: 'email_reseller_options' });
  const typeOptions = await getConfigDropdownOptions({ key: 'sender_account_types' });

  const platformOptionsMapped = mapDisplayValueToLabelValue(platformOptions);
  const emailServerOptionsMapped = mapDisplayValueToLabelValue(emailServerOptions);
  const emailResellerOptionsMapped = mapDisplayValueToLabelValue(emailResellerOptions);
  const typeOptionsMapped = mapDisplayValueToLabelValue(typeOptions);

  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <EventSendersHeader />

      <EventSendersTab
        key={JSON.stringify(rows)}
        rows={rows}
        platFormOptions={platformOptionsMapped}
        hostOptions={senderProfiles}
        emailServerOptions={emailServerOptionsMapped}
        emailResellerOptions={emailResellerOptionsMapped}
        typeOptions={typeOptionsMapped}
      />
    </Container>
  );
};

export default EventSendersPage;
