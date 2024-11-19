import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { getSenderProfiles } from 'src/services/db/user-settings';

type AssignedProfileDropdownTypes = {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
};

export default function AssignedProfileDropdown({ params }: AssignedProfileDropdownTypes) {
  const [state, setstate] = useState(params.value);
  const [profiles, setProfiles] = useState<
    {
      profile: string;
      id: string;
    }[]
  >([]);
  const handleChange = (e: SelectChangeEvent<any>) => {
    setstate(e.target.value);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      console.log('call');
      const userProfiles = await getSenderProfiles();
      setProfiles(userProfiles);
    };
    fetchProfiles();
  }, []);

  return (
    <Select
      value={state}
      onChange={handleChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
    >
      {profiles.map((profile) => (
        <MenuItem value={profile.id} key={`${profile.id}-${params.id}`}>
          {profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
}
