import { Card } from '@mui/material';
import React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
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

const UnverifiedTable = async ({ type }: { type: UnverifiedType }) => {
  const rows = (await getSendersAddresses()) as GridValidRowModel[];
  return (
    <Card>
      <Table rows={rows} />
    </Card>
  );
};

export default UnverifiedTable;
