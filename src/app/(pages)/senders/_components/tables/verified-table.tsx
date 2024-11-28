import { getVerifiedEmails } from 'src/services/db/sender-addresses';

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

  return <Table rows={rows} options={options} type="verified" action="delete" />;
};

export default VerifiedTable;
