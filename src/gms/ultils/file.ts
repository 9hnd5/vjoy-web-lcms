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

export const jsonToCsv = (json: any) => {
  const csv = Papa.unparse(json);
  const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const file = new File([csvData], "sample.csv", { type: "text/csv" });
  const dt = new DataTransfer();
  dt.items.add(file);
  return dt.files;
};
