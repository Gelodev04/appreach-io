import { getSenderDomains } from 'src/services/db/sender-domains';
import DomainsAccordion from '../accordion/verified-domains-accord';

export type VerifiedDomainsType = {
  options: {
    profile: string;
    id: string;
  }[];
};

export default async function VerifiedDomains({ options }: VerifiedDomainsType) {
  const senderDomains = await getSenderDomains();

  return <DomainsAccordion domains={senderDomains} options={options} />;
}
