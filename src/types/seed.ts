import { ObjectId } from 'mongodb';

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

interface ISeedNew {
  _id: ObjectId;
  dateAdded: Date;
  generate: {
    // clickLink: boolean;
    // downloadMessage: boolean;
    esps: {
      googleBusiness: number;
      googlePersonal: number;
      microsoftBusiness: number;
      microsoftPersonal: number;
      yahooPersonal: number;
    };
    // markImportant: boolean;
    // movePrimary: boolean;
    // prioritizeToken: string | null;
    // removeSpam: boolean;
    // replyMessage: boolean;
    // scrollMessage: boolean;
    total: number;
    type: string;
  };
  hostId: ObjectId;
  name: string;
  results: {
    csvUrl: string;
    total: number;
    esps: {
      googleBusiness: number;
      googlePersonal: number;
      microsoftBusiness: number;
      microsoftPersonal: number;
      yahooPersonal: number;
    };
  };
  status: string; // ready, success and expired
  // token: string;
}
