import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { updateSenderProfiles } from 'src/services/db/sender-addresses';

type AssignedProfileDropdownTypes = {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  options: {
    profile: string;
    id: string;
  }[];
};

export default function AssignedProfileDropdown({ params, options }: AssignedProfileDropdownTypes) {
  const [isPending, startTransition] = useTransition();
  const urlParams = useSearchParams();
  const tableIndex = urlParams.get('tableIndex');
  const handleChange = (e: SelectChangeEvent<any>) => {
    startTransition(async () => {
      try {
        if (!tableIndex) return undefined;
        await updateSenderProfiles(params.id as string, e.target.value, tableIndex);
      } catch (error) {
        throw new Error('Unable to update the assigned profile.');
      }
    });
  };

  return (
    <Select
      value={params.value}
      disabled={isPending}
      onChange={handleChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
    >
      {options.map((profile) => (
        <MenuItem value={profile.id} key={`${profile.id}-${params.id}`}>
          {isPending ? 'Updating...' : profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
}
