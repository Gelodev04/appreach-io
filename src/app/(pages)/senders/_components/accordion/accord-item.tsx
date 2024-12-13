'use client';

import { Accordion, AccordionDetails, AccordionSummary, useTheme } from '@mui/material';
import { useState } from 'react';
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
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <Accordion
      variant="outlined"
      disableGutters
      square
      expanded={expanded}
      sx={{
        '&.Mui-expanded': {
          borderRadius: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon isVerified={verified} onClick={handleToggle} />}
        sx={{
          height: 20,
          boxShadow: theme.shadows[1],
        }}
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
