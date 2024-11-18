import { Container } from '@mui/material';
import AddressesHeader from './_components/addresses-header';
import VerificationTable from './_components/verification-table';
import SenderUsed from './_components/sender-used';

export const metadata = {
  title: 'Sender Addresses | Inbox Daddy',
};

const SendersAddressesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <AddressesHeader />
      <SenderUsed />
      <VerificationTable />
    </Container>
  );
};

export default SendersAddressesPage;
