import Papa from "papaparse";
export const csvToJson = <T>(file: File) => {
  return new Promise<T[]>((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
