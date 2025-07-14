export const getCountrySummaryData = (countryName, dataset) => {
  const countryRecords = dataset.filter((d) => d.Country === countryName);

  if (countryRecords.length === 0) return null;

  const yearsCovered = [...new Set(countryRecords.map((r) => r.Year))];
  const reportTypes = [...new Set(countryRecords.map((r) => r["Species composition of catch"]))];

  return {
    uploads: countryRecords.length,
    uploadDates: [], // We’ll fill this with Firestore next
    downloadDates: [],
    yearsCovered,
    reportTypes
  };
};
