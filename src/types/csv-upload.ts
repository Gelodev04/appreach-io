import { ObjectId } from 'mongodb';

export interface ICsvUpload {
  _id: ObjectId;
  host: string;
  importName: string;
  importSource: string;
  status: string;
  companyCreated: number;
  companyUpdated: number;
  companyIgnored: number;
  personCreated: number;
  personUpdated: number;
  personIgnored: number;
  errors: number;
  dateUploaded: Date;
}

export interface ICsvUploadForm {
  id: string;
  host: string;
  hostCrypt: string;
  lookerStudioUrl: string;
  timezone: string;
  notificationAddresses: string;
  externalSenderAddresses: string;
  inboxEngagement: string[];
}
