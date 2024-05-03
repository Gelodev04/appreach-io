import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login | Oureach Magic',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
