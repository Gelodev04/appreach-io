export interface IEmail {
  id: string;
  email: string;
  host: string;
  server: string;
  inboxPlacement: boolean;
  inboxEngagement: boolean;
  placementAccount: boolean;
  engagementAccount: boolean;
  inboxReset: boolean;
  relayAccount: boolean;
  vpsName: string;
  smtp: boolean;
  imap: boolean;
  status: 'Active' | 'Disabled';
}

export interface IAddEmailsBulk {
  host: string;
  accounts: string;
  status: 'Active' | 'Disabled';
  engagementAccount: boolean;
  placementAccount: boolean;
  engagementApi: boolean;
}
