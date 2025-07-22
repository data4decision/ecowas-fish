import * as XLSX from "xlsx";

export const loadCountryExcel = async (countryCode) => {
  const fileMap = {
    ghana: "/data/ghana_data.xlsx",
    nigeria: "/data/nigeria-data.xlsx",
    benin: "/data/benin_data.xlsx"
  };

  const fileUrl = fileMap[countryCode.toLowerCase()];
  if (!fileUrl) throw new Error("No file for this country");

  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data;
};
