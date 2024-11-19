'use client';

import React from 'react';
import { Card } from '@mui/material';

import { getVerifiedEmails } from 'src/services/db/verified-domains';
import useSWR from 'swr';
import Table from './table';
// Fetcher function for SWR
const fetcher = async () => {
  const data = await getVerifiedEmails();
  console.log({ data });
  return data;
};

const VerifiedTable = () => {
  const { data: rows } = useSWR('verified-email', fetcher);

  if (!rows) throw new Error('Unable to get rows');

  return (
    <Card>
      <Table rows={rows} action="delete" />
    </Card>
  );
};

export default VerifiedTable;
