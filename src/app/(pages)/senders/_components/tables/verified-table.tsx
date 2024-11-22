import { getVerifiedEmails } from 'src/services/db/verified-domains';

import Table from './table';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
  type: 'email' | 'domain';
};

const VerifiedTable = async ({ type, options }: TableOptions) => {
  const rows = await getVerifiedEmails(type);

  if (!rows) throw new Error('Unable to get rows');

  return <Table rows={rows} action="delete" options={options} />;
};

export default VerifiedTable;
