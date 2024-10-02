import { VerifyAccountView } from 'src/sections/auth';

export const metadata = {
  title: 'Verify Account | Inbox Daddy',
};

export default function VerifyAccountPage({ params }: { params: { id: string; token: string } }) {
  return <VerifyAccountView id={params.id} token={params.token} />;
}
