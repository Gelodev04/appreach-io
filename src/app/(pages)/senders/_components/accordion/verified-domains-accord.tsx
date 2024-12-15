import { Box } from '@mui/material';
import AccordItem from './accord-item';

type DomainsAccordionType = {
  domains: {
    id: string;
    domain: string;
    txtRecord: string | null;
    verified: boolean;
    hostId: string;
  }[];
  options: {
    profile: string;
    id: string;
  }[];
};
export default function DomainsAccordion({ domains, options }: DomainsAccordionType) {
  return (
    <Box sx={{ marginY: 4 }} padding={2}>
      {domains.map((domain) => (
        <AccordItem key={domain.id} {...domain} options={options} />
      ))}
    </Box>
  );
}
