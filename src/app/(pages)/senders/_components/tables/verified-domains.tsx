import { getSenderDomains } from 'src/services/db/sender-domains';
import DomainsAccordion from '../accordion/verified-domains-accord';

export default async function VerifiedDomains() {
  const senderDomains = await getSenderDomains();

  return <DomainsAccordion domains={senderDomains} />;
}
