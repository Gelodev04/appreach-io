import { Card } from '@mui/material';
import React from 'react';
import Table from './table';

type UnverifiedType = 'email' | 'domain';
const rows = [
  { id: 1, name: 'oms.dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 2, name: 'oms.dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 3, name: 'oms.dennis@gmail.com', assignedProfile: 'profile_xyz' },
];
const UnverifiedTable = ({ type }: { type: UnverifiedType }) => {
  return (
    <Card>
      <Table rows={rows} />
    </Card>
  );
};

export default UnverifiedTable;
