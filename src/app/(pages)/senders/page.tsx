import { Container, Skeleton } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { Suspense } from 'react';
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
        verifiedEmails={
          <Suspense fallback={<Skeleton height={650} />}>
            <VerifiedTable type="email" options={senderProfiles} />
          </Suspense>
        }
        unverifiedSenders={
          <Suspense fallback={<Skeleton height={650} />}>
            <UnverifiedTable options={senderProfiles} />
          </Suspense>
        }
        verifiedDomains={
          <Suspense fallback={<Skeleton height={650} />}>
            <VerifiedTable type="domain" options={senderProfiles} />
          </Suspense>
        }
      />
    </Container>
  );
};

export default SendersAddressesPage;
