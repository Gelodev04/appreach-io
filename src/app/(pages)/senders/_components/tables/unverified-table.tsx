import { getUnverifiedSenders } from 'src/services/db/sender-addresses';
import Table from './table';

const mockRows = [
  { id: 1, name: 'oms.dennisa@gmail.com', assignedProfile: 'profile_ghi' },
  { id: 2, name: 'oms.dennisb@gmail.com', assignedProfile: 'profile_abc' },
  { id: 3, name: 'oms.dennisc@gmail.com', assignedProfile: 'profile_def' },
];
export const getSendersAddresses = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRows), 1000);
  });
};

type UnverifiedTableType = {
  options: {
    profile: string;
    id: string;
  }[];
};

const UnverifiedTable = async ({ options }: UnverifiedTableType) => {
  const rows = await getUnverifiedSenders();

  if (!rows) throw new Error('Unable to get rows');

  return <Table rows={rows} options={options} type="unverified" />;
};

export default UnverifiedTable;
