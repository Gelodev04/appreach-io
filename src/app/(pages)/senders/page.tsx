import { Container, Skeleton } from '@mui/material';
import { Suspense } from 'react';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getAddressesPlanPermissions, getSenderProfiles } from 'src/services/db/user-settings';
import AddressesHeader from './_components/addresses-header';
import {
  ActiveSenderEmailsTable,
  ArchivedSenderEmailsTable,
  VerifiedDomains,
} from './_components/tables';
import SendersTabs from './_components/tabs/sender-tabs';

export const metadata = {
  title: 'Sender Addresses | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const SendersAddressesPage = async () => {
  const senderProfiles = await getSenderProfiles();
  const addressesPlanPermissions = await getAddressesPlanPermissions();
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AddressesHeader isAllAddressedUsed={addressesPlanPermissions.isAllAddressesUsed} />

      <ItemUsageDisplay
        itemName="Senders"
        used={addressesPlanPermissions.numOfAddressesUsed}
        limit={addressesPlanPermissions.numOfAddressesAssigned}
      />

      <SendersTabs
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
            <VerifiedDomains options={senderProfiles} />
          </Suspense>
        }
      />
    </Container>
  );
};

export default SendersAddressesPage;
