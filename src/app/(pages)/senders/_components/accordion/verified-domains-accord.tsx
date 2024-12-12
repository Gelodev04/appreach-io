import { Box, Paper } from '@mui/material';
import AccordItem from './accord-item';

type DomainsAccordionType = {
  domains: {
    id: string;
    domain: string;
    textRecord: string | null;
    verified: boolean;
    hostId: string;
  }[];
};
export default function DomainsAccordion({ domains }: DomainsAccordionType) {
  return (
    <Box sx={{ minHeight: 600 }} padding={2}>
      {domains.map((domain) => (
        <AccordItem key={domain.id} {...domain} />
      ))}
    </Box>
  );
}
