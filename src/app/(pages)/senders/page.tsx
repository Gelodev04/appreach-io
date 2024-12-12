import { Container, Skeleton } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { Suspense } from 'react';
import AddressesHeader from './_components/addresses-header';
import SenderUsed from './_components/sender-used';

import SendersTables from './_components/tabs/sender-tables';
import ActiveSenderEmailsTable from './_components/tables/active-sender-emails-table';
import ArchivedSenderEmailsTable from './_components/tables/archived-sender-emails-table';
import VerifiedDomains from './_components/accordion/verified-domains';

export const metadata = {
  title: 'Sender Addresses | Inbox Daddy',
};

const SendersAddressesPage = async () => {
  const senderProfiles = await getSenderProfiles();
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AddressesHeader />
      <SenderUsed />
      <SendersTables
        activeSenderEmails={
          <Suspense fallback={<Skeleton height={650} />}>
            <ActiveSenderEmailsTable options={senderProfiles} />
          </Suspense>
        }
        archivedSenderEmails={
          <Suspense fallback={<Skeleton height={650} />}>
            <ArchivedSenderEmailsTable options={senderProfiles} />
          </Suspense>
        }
        verifiedDomains={
          <Suspense fallback={<Skeleton height={650} />}>
            <VerifiedDomains />
          </Suspense>
        }
      />
    </Container>
  );
};

export default SendersAddressesPage;
