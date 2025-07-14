// src/utils/uploadExcelToFirestore.js

import * as XLSX from "xlsx";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the path if needed

/**
 * Uploads an Excel file to Firestore under the specified country's collection.
 * 
 * @param {File} file - Excel file (.xls or .xlsx)
 * @param {string} countryCode - Country code to organize data
 * @returns {Promise<string>} - A promise resolving to success message
 */
export const uploadExcelToFirestore = async (file, countryCode) => {
  if (!file || !countryCode) {
    throw new Error("File and country code are required.");
  }

  // Validate file type
  const validTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (!validTypes.includes(file.type)) {
    throw new Error("Please upload a valid Excel file (.xls or .xlsx).");
  }

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        // Parse workbook from file
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error("No sheet found in the Excel file.");
        }

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!jsonData.length) {
          throw new Error("Excel sheet is empty.");
        }

        // Target Firestore path: uploads/{countryCode}/records
        const dataRef = collection(
          db,
          "uploads",
          countryCode.toLowerCase(),
          "records"
        );

        // Upload each row as a Firestore document
        for (const row of jsonData) {
          await addDoc(dataRef, {
            ...row,
            countryCode: countryCode.toLowerCase(),
            uploadedAt: Timestamp.now(),
          });
        }

        resolve("Upload complete.");
      } catch (error) {
        console.error("Upload failed:", error);
        reject(error.message || "Error processing the file.");
      }
    };

    reader.onerror = () => {
      reject("Failed to read the file.");
    };

    reader.readAsBinaryString(file);
  });
};
