import { Container } from '@mui/material';

import { getSenderProfiles } from 'src/services/db/user-settings';
import AddressesHeader from './_components/addresses-header';
import SenderUsed from './_components/sender-used';
import SendersVerificationTable from './_components/tabs/senders-verification-table';
import { UnverifiedTable, VerifiedTable } from './_components/tables';

export const metadata = {
  title: 'Sender Addresses | Inbox Daddy',
};

const SendersAddressesPage = async () => {
  const senderProfiles = await getSenderProfiles();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AddressesHeader />
      <SenderUsed />
      <SendersVerificationTable
        verifiedTable={<VerifiedTable options={senderProfiles} />}
        verifiedDomainTable={<VerifiedTable options={senderProfiles} />}
        unverifiedEmailTable={<UnverifiedTable type="email" options={senderProfiles} />}
      />
    </Container>
  );
};

export default SendersAddressesPage;
