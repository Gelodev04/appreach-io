import { useMemo } from 'react';

import { ICsvUpload } from 'src/types/csv-uploads';

// ----------------------------------------------------------------------

const CSV_UPLOADS: ICsvUpload[] = [
  {
    id: '1',
    host: 'e3recruiting',
    importName:
      'electrical or electronic manufacturing, owner job titles, 21-100 headcount, united states',
    importSource: 'apollo',
    companyCreated: 1561,
    companyUpdated: 10,
    companyIgnored: 100,
    personCreated: 2135,
    personUpdated: 11,
    personIgnored: 77,
    errors: 1,
    dateUploaded: new Date('May 17 2024 00:21:46'),
    status: 'success',
  },
  {
    id: '2',
    host: 'e3recruiting',
    importName:
      'mechanical or industrial engineering, owner job titles, 21-100 headcount, united states',
    importSource: 'apollo',
    companyCreated: 1973,
    companyUpdated: 57,
    companyIgnored: 1931,
    personCreated: 3192,
    personUpdated: 26,
    personIgnored: 1322,
    errors: 0,
    dateUploaded: new Date('May 16 2024 23:54:18'),
    status: 'success',
  },
  {
    id: '3',
    host: 'outreachmagic',
    importName: 'Greater San Diego Area Property Manager, Asset Manager 25+ HC',
    importSource: 'apollo',
    companyCreated: 323,
    companyUpdated: 10,
    companyIgnored: 120,
    personCreated: 694,
    personUpdated: 1,
    personIgnored: 0,
    errors: 2,
    dateUploaded: new Date('Apr 26 2024 13:50:33'),
    status: 'success',
  },
  {
    id: '4',
    host: 'e3recruiting',
    importName: 'event manager, planner, director, 101-200 hc, united states',
    importSource: 'apollo',
    companyCreated: 2972,
    companyUpdated: 195,
    companyIgnored: 13,
    personCreated: 4579,
    personUpdated: 16,
    personIgnored: 0,
    errors: 21,
    dateUploaded: new Date('Apr 08 2024 04:08:23'),
    status: 'success',
  },
  {
    id: '5',
    host: 'popcam',
    importName: 'event manager, planner, director, 101-200 hc, united states',
    importSource: 'apollo',
    companyCreated: 2736,
    companyUpdated: 89,
    companyIgnored: 469,
    personCreated: 4511,
    personUpdated: 16,
    personIgnored: 68,
    errors: 21,
    dateUploaded: new Date('Apr 08 2024 04:05:00'),
    status: 'success',
  },
  {
    id: '6',
    host: 'traduality',
    importName: 'production, senior positions, hospital, food processing, retail, hc 20-1000',
    importSource: 'apollo',
    companyCreated: 331,
    companyUpdated: 4,
    companyIgnored: 686,
    personCreated: 1063,
    personUpdated: 2,
    personIgnored: 1,
    errors: 0,
    dateUploaded: new Date('Mar 26 2024 12:02:39'),
    status: 'success',
  },
];

export function useGetCsvUploads() {
  const memoizedValue = useMemo(
    () => ({
      csvUploads: CSV_UPLOADS,
      csvUploadsLoading: false,
      csvUploadsError: false,
      csvUploadsValidating: false,
      csvUploadsEmpty: !CSV_UPLOADS.length,
    }),
    []
  );

  return memoizedValue;
}
