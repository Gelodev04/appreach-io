import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { EmailValidatorHeader } from './_components/email-validator-header';

export const metadata = {
  title: 'Email Validator | Inbox Daddy',
};

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <EmailValidatorHeader />

      <ItemUsageDisplay itemName="Credits" used={300} limit={500} />
    </Container>
  );
}
