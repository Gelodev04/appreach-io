import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { updateSenderProfiles } from 'src/services/db/sender-addresses';
import { updateDomainProfiles } from 'src/services/db/sender-domains';

type AssignedProfileDropdownTypes = {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  options: {
    profile: string;
    id: string;
  }[];
  type: 'email' | 'domain';
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AssignedProfileDropdown({
  params,
  options,
  type,
}: AssignedProfileDropdownTypes) {
  const [isPending, startTransition] = useTransition();
  const urlParams = useSearchParams();
  const tableIndex = urlParams.get('tableIndex');

  const handleChange = (e: SelectChangeEvent<any>) => {
    startTransition(async () => {
      try {
        if (!tableIndex) return undefined;
        if (type === 'email') {
          await updateSenderProfiles(params.id as string, e.target.value, tableIndex);
        } else {
          await updateDomainProfiles(params.id as string, e.target.value, tableIndex);
        }
      } catch (error) {
        throw new Error('Unable to update the assigned profile. Please contact support.');
      }
    });
  };

  return (
    <Select
      value={params.value}
      disabled={isPending}
      onChange={handleChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
      MenuProps={MenuProps}
    >
      {options.map((profile) => (
        <MenuItem value={profile.id} key={`${profile.id}-${params.id}`}>
          {profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
}
