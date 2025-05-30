export type LeadStatusOption = {
  display: string;
  value: string;
  sentiment: string;
};

export type ManualEventsData = {
  event_timestamp: string;
  platform: string;
  content: {
    body: string | undefined;
    view_url?: string;
  };
  host_id: string;
  host_name: string;
  lead_status: {
    name: string;
    sentiment: string;
  };
  leads: string[];
  senders: string;
  event_type: string;
};
