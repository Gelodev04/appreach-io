import { ConfirmResetPasswordView } from 'src/sections/auth';

export const metadata = {
  title: 'Create New Password | Inbox Daddy',
};

export default function ConfirmResetPasswordPage({
  params,
}: {
  params: { id: string; token: string };
}) {
  return <ConfirmResetPasswordView id={params.id} token={params.token} />;
}
