'use client';

import { TabPanel } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Card } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { GridRowsProp } from '@mui/x-data-grid';
import * as React from 'react';
import TabTitle from 'src/app/(pages)/senders/verified-senders/_components/tabs/tab-title';
import { MissingAttributesCompanyStyle, MissingAttributesPersonStyle } from '../style';
import { MissingAttributesTable } from './missing-attributes-table';

export const MissingAttributesTab = ({
  personRows,
  companyRows,
}: {
  personRows: GridRowsProp;
  companyRows: GridRowsProp;
}) => {
  const [value, setValue] = React.useState('person');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  console.log({ companyRows });
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        mt: 3,
        height: '100%',
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            textColor="primary"
            onChange={handleChange}
            indicatorColor="primary"
            variant="fullWidth"
            aria-label="Missing Attributes Tab"
            TabIndicatorProps={{ sx: { backgroundColor: '#003087' } }}
          >
            <Tab
              label={
                <TabTitle
                  title="Missing Person Attributes"
                  icon="material-symbols:user-attributes-rounded"
                />
              }
              value="person"
            />
            <Tab
              label={
                <TabTitle title="Missing Company Attributes" icon="fluent:building-20-filled" />
              }
              value="company"
            />
          </TabList>
        </Box>
        <TabPanel value={value} sx={{ p: 0, height: '100%' }}>
          {value === 'person' && (
            <MissingAttributesTable
              rows={personRows}
              attributeType="person"
              lastCol={8}
              customStyle={MissingAttributesPersonStyle}
            />
          )}
          {value === 'company' && (
            <MissingAttributesTable
              rows={companyRows}
              attributeType="company"
              lastCol={6}
              customStyle={MissingAttributesCompanyStyle}
            />
          )}
        </TabPanel>
      </TabContext>
    </Card>
  );
};
