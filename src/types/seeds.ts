export type ISeed = {
  id: string;
  name: string;
  dateAdded: string;
  generateTotal: number;
  resultsTotal: number;
  token: string;
  status: 'success' | 'error' | 'expired';
  csvUrl: string;
};

export interface ISeedForm {
  id: string;
  name: string;
  hostCrypt: string;
  lookerStudioUrl: string;
  timezone: string;
  notificationAddresses: string;
  externalSenderAddresses: string;
  inboxEngagement: string[];
}
