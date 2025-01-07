import { getAddressesPlanPermissions } from 'src/services/db/user-settings';
import { Container, Typography } from '@mui/material';
import AddSenderEmailPage from './_components/senders-email';
import Header from './_components/header';

const EmailPage = async () => {
  const addressesPlanPermissions = await getAddressesPlanPermissions();

  if (addressesPlanPermissions.isAllAddressesUsed) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Header />
        <Typography variant="h4">
          You have already used all available sender address. Please upgrade your subscription to
          continue.
        </Typography>
      </Container>
    );
  }
  return <AddSenderEmailPage />;
};

export default EmailPage;
