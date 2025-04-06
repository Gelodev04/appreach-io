export type PlatformOption = {
  display: string;
  value: string;
  signup_url: string;
  description: string;
};

export type LeadStatusOption = {
  display: string;
  value: string;
  sentiment: string;
};

export type LeadStatusData = {
  event_timestamp: string;
  platform: string;
  content: {
    body: string | undefined;
  };
  host_id: string;
  host_name: string;
  lead_category: {
    name: string;
    sentiment: string;
  };
  leads: string[];
  senders: string;
};
