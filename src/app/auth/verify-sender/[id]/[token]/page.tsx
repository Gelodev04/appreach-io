import VerifySender from '../../_component/verify-sender';

export const metadata = {
  title: 'Verify Account | Inbox Daddy',
};

export default function VerifyAccountPage({ params }: { params: { id: string; token: string } }) {
  return <VerifySender id={params.id} token={params.token} />;
}
