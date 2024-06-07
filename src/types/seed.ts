import { ObjectId } from 'mongodb';

export interface ISeedForm {
  dateAdded: Date;
  generate: ISeedGenerate;
  hostId: string;
  name: string;
}

export interface ISeed {
  _id: ObjectId;
  dateAdded: Date;
  generate: ISeedGenerate;
  hostId: ObjectId;
  name: string;
  results: ISeedResults;
  token: string;
  status: string;
}

interface ISeedGenerate {
  esps: ISeedEsps;
  total: number;
  type: string;
}

interface ISeedResults {
  csvUrl: string;
  total: number;
  esps: ISeedEsps;
}

interface ISeedEsps {
  googleBusiness: number;
  googlePersonal: number;
  microsoftBusiness: number;
  microsoftPersonal: number;
  yahooPersonal: number;
}
