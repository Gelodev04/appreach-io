import { Card, Skeleton } from '@mui/material';
import React, { Suspense } from 'react';
import { getUnverifiedSenders } from 'src/services/db/verified-domains';
import Table from './table';

type UnverifiedType = 'email' | 'domain';
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
  type: UnverifiedType;
  options: {
    profile: string;
    id: string;
  }[];
};

const UnverifiedTable = async ({ type, options }: UnverifiedTableType) => {
  const rows = await getUnverifiedSenders(type);
  if (!rows) throw new Error('Unable to get rows');
  return (
    <Suspense fallback={<Skeleton height={600} />}>
      <Card>
        <Table rows={rows} options={options} />
      </Card>
    </Suspense>
  );
};

export default UnverifiedTable;
