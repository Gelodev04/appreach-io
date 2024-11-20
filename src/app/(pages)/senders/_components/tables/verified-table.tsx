import React, { Suspense } from 'react';
import { Card, Skeleton } from '@mui/material';

import { getVerifiedEmails } from 'src/services/db/verified-domains';

import Table from './table';

export type TableOptions = {
  options: {
    profile: string;
    id: string;
  }[];
};

const VerifiedTable = async ({ options }: TableOptions) => {
  const rows = await getVerifiedEmails();

  if (!rows) throw new Error('Unable to get rows');

  return <Table rows={rows} action="delete" options={options} />;
};

export default VerifiedTable;
