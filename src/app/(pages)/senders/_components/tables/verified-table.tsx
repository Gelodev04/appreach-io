import React from 'react';
import { Card } from '@mui/material';
import Table from './table';

const rows = [
  { id: 1, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 2, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 3, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 4, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 5, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
  { id: 6, name: 'dennis@gmail.com', assignedProfile: 'profile_xyz' },
];
const VerifiedTable = () => {
  return (
    <Card>
      <Table rows={rows} action="delete" />
    </Card>
  );
};

export default VerifiedTable;
