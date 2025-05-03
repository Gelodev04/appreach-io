import { RegisterView } from 'src/sections/auth/view';
import { getConfigDropdownOptions } from 'src/services/db/config';
import { mapDisplayValueToLabelValue } from 'src/utils';

export const metadata = {
  title: 'Register | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });

  const platformOptionsMapped = mapDisplayValueToLabelValue(platformOptions);

  return <RegisterView platformOptions={platformOptionsMapped} />;
}
