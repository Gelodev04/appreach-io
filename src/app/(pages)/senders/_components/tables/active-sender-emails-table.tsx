import React from 'react';
import { getActiveSenderEmails } from 'src/services/db/sender-addresses';
import TableV2 from './tableV2';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
};

export default async function ActiveSenderEmailsTable({ options }: TableOptions) {
  const rows = await getActiveSenderEmails();
  return <TableV2 rows={rows} options={options} />;
}
