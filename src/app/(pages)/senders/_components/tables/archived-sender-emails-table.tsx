import { getArhivedSenderEmails } from 'src/services/db/sender-addresses';
import Table from './table';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
};

export default async function ArchivedSenderEmailsTable({ options }: TableOptions) {
  const rows = await getArhivedSenderEmails();
  return <Table rows={rows} options={options} isArchived />;
}
