import { getArhivedSenderEmails } from 'src/services/db/sender-addresses';
import TableV2 from './tableV2';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
};

export default async function ArchivedSenderEmailsTable({ options }: TableOptions) {
  const rows = await getArhivedSenderEmails();
  return <TableV2 rows={rows} options={options} isArchived />;
}
