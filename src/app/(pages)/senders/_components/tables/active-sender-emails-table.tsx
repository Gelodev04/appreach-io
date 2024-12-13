import { getActiveSenderEmails } from 'src/services/db/sender-addresses';
import Table from './table';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
};

export default async function ActiveSenderEmailsTable({ options }: TableOptions) {
  const rows = await getActiveSenderEmails();
  return <Table rows={rows} options={options} />;
}
