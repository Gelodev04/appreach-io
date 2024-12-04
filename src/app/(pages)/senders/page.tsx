import { Container, Skeleton } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { Suspense } from 'react';
import AddressesHeader from './_components/addresses-header';
import SenderUsed from './_components/sender-used';
import SendersVerificationTable from './_components/tabs/senders-verification-table';
import { UnverifiedTable, VerifiedTable } from './_components/tables';
import VerifiedTab from './_components/tabs/verified-tab';
import ArchivedTable from './_components/tables/archived-table';

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
        verifiedTabs={
          <VerifiedTab
            verifiedDomain={
              <Suspense fallback={<Skeleton height={650} />}>
                <VerifiedTable type="domain" options={senderProfiles} />{' '}
              </Suspense>
            }
            verifiedEmail={
              <Suspense fallback={<Skeleton height={650} />}>
                <VerifiedTable type="email" options={senderProfiles} />
              </Suspense>
            }
          />
        }
        unverifiedSenders={
          <Suspense fallback={<Skeleton height={650} />}>
            <UnverifiedTable options={senderProfiles} />
          </Suspense>
        }
        archivedTab={
          <Suspense fallback={<Skeleton height={650} />}>
            <ArchivedTable />
          </Suspense>
        }
      />
    </Container>
  );
};

export default SendersAddressesPage;
