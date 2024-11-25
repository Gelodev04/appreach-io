import { getVerifiedEmails } from 'src/services/db/verified-domains';

import Table from './table';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
  type: 'email' | 'domain';
  action?: 'delete' | 'edit' | 'both';
};

const VerifiedTable = async ({ type, options, action }: TableOptions) => {
  const rows = await getVerifiedEmails(type);

  if (!rows) throw new Error('Unable to get rows');

  return <Table rows={rows} action={action} options={options} />;
};

export default VerifiedTable;
