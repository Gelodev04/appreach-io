import Papa from 'papaparse';

export const parseCSVFile = (file: File) => {
  return new Promise<any>((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => resolve(result),
      error: (error) => reject(error),
      header: true,
      skipEmptyLines: true,
    });
  });
};
