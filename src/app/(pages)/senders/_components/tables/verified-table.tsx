import React from 'react';
import { Card } from '@mui/material';
import { GridValidRowModel } from '@mui/x-data-grid';
import Table from './table';

const mockRows = [
  { id: 1, name: 'dennis1@gmail.com', assignedProfile: 'profile_xyz1' },
  { id: 2, name: 'dennis2@gmail.com', assignedProfile: 'profile_xyz2' },
  { id: 3, name: 'dennis3@gmail.com', assignedProfile: 'profile_xyz3' },
  { id: 4, name: 'dennis4@gmail.com', assignedProfile: 'profile_xyz4' },
  { id: 5, name: 'dennis5@gmail.com', assignedProfile: 'profile_xyz5' },
  { id: 6, name: 'dennis6@gmail.com', assignedProfile: 'profile_xyz6' },
];

export const getSendersAddresses = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRows), 1000);
  });
};

const VerifiedTable = async () => {
  const rows = (await getSendersAddresses()) as GridValidRowModel[];

  return (
    <Card>
      <Table rows={rows} action="delete" />
    </Card>
  );
};

export default VerifiedTable;
