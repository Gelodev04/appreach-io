import { Container } from '@mui/material';
import { getUserSettings } from 'src/services/db/user-settings';
import { WebhooksHeader } from './_components/webhooks-header';
import { WebhooksTable } from './_components/webhooks-table';

export const metadata = {
  title: 'Webhooks | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const rows = [
  {
    id: '1',
    product: 'Email Bison',
    product_link: 'https://emailbison.com/',
    about: 'White-labeled, privately hosted email sequencing.',
    events_webhook: 'https://api2.outreachmagic.io/webhooks/emailbision?token={tokenHash}',
  },
  {
    id: '2',
    product: 'Smartlead',
    product_link: 'https://smartlead.ai',
    about: 'Cold email outreach with premium deliverability.',
    events_webhook: 'https://api2.outreachmagic.io/webhooks/smartlead?token={tokenHash}',
  },
  {
    id: '3',
    product: 'Instantly',
    product_link: 'https://instantly.ai/',
    about: 'Automated outreach with AI-powered personalization.',
    events_webhook: 'https://api2.outreachmagic.io/webhooks/instantly?token={tokenHash}',
  },
  {
    id: '4',
    product: 'HeyReach',
    product_link: 'https://www.heyreach.io/',
    about: 'LinkedIn automation with unlimited senders.',
    events_webhook: 'https://api2.outreachmagic.io/webhooks/heyreach?token={tokenHash}',
  },
  {
    id: '5',
    product: 'Props.ai',
    product_link: 'https://prosp.ai/',
    about: 'AI-driven LinkedIn outbound personalization.',
    events_webhook: 'https://api2.outreachmagic.io/webhooks/prosp?token={tokenHash}',
  },
];

export default async function Page() {
  const { webhook } = await getUserSettings({ webhook: { select: { token: true } } });
  console.log(webhook);
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <WebhooksHeader />

      <WebhooksTable rows={rows} token={webhook?.token} />
    </Container>
  );
}
