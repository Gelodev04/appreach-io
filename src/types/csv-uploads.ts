export interface ICsvUpload {
  id: string;
  host: string;
  importName: string;
  importSource: string;
  companyCreated: number;
  companyUpdated: number;
  companyIgnored: number;
  personCreated: number;
  personUpdated: number;
  personIgnored: number;
  errors: number;
  dateUploaded: Date;
  status: string;
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
