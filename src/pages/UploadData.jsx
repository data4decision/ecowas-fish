
import { uploadExcelToFirestore } from "../utils/UploadExcelFileToFiresore";

function UploadData({ user }) {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Upload Excel Report</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && user?.countryCode) {
            uploadExcelToFirestore(file, user.countryCode)
              .then(msg => alert(msg))
              .catch(err => alert(`Error: ${err}`));
          } else {
            alert("File or country code missing.");
          }
        }}
      />
    </div>
  );
}

export default UploadData;
