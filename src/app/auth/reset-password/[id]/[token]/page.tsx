import { ConfirmResetPasswordView } from 'src/sections/auth';

export const metadata = {
  title: 'Create New Password | Outreach Magic',
};

export default function ConfirmResetPasswordPage({
  params,
}: {
  params: { id: string; token: string };
}) {
  return <ConfirmResetPasswordView id={params.id} token={params.token} />;
}
