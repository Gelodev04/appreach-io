import dynamic from 'next/dynamic';
import { Container, Skeleton } from '@mui/material';

import { getSenderProfiles } from 'src/services/db/user-settings';
import AddressesHeader from './_components/addresses-header';
import SenderUsed from './_components/sender-used';
import SendersVerificationTable from './_components/tabs/senders-verification-table';

export const metadata = {
  title: 'Sender Addresses | Inbox Daddy',
};

const VerifiedTable = dynamic(() => import('./_components/tables/verified-table'), {
  loading: () => <Skeleton height={600} />,
});

const UnverifiedTable = dynamic(() => import('./_components/tables/unverified-table'), {
  loading: () => <Skeleton height={600} />,
});

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
