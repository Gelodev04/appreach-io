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
