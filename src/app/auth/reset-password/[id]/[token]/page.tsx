import { ResetPasswordView } from 'src/sections/auth';

export const metadata = {
  title: 'Create New Password | Outreach Magic',
};

export default function CreateNewPasswordPage({
  params,
}: {
  params: { id: string; token: string };
}) {
  return <ResetPasswordView id={params.id} token={params.token} />;
}
