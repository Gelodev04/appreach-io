'use client';

import { Accordion, AccordionDetails, AccordionSummary, useTheme } from '@mui/material';
import AccordHeader from './accord-header';
import ExpandIcon from './expand-icon';
import AccordDetails from './accord-details';

type AccordItemType = {
  id: string;
  domain: string;
  txtRecord: string | null;
  verified: boolean;
  hostId: string;
};

export default function AccordItem({ domain, hostId, id, txtRecord, verified }: AccordItemType) {
  const theme = useTheme();
  return (
    <Accordion variant="outlined">
      <AccordionSummary
        expandIcon={<ExpandIcon isVerified={verified} />}
        sx={{ height: 20, boxShadow: theme.shadows[1] }}
        disabled={verified}
      >
        <AccordHeader domain={domain} isVerified={verified} />
      </AccordionSummary>
      <AccordionDetails>
        <AccordDetails id={id} txtRecord={txtRecord} />
      </AccordionDetails>
    </Accordion>
  );
}
