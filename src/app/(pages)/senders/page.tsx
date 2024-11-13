import { Container } from '@mui/material';
import AddressesHeader from './_components/addresses-header';
import VerificationTable from './_components/verification-table';

export const metadata = {
  title: 'Sender Addresses | Inbox Daddy',
};

const SendersAddressesPage = () => {
  return (
    <Container maxWidth="lg">
      {/* TODO: AddressesHeader Component 
         TODO: Verification Component */}
      <AddressesHeader />
      <VerificationTable />
    </Container>
  );
};

export default SendersAddressesPage;
