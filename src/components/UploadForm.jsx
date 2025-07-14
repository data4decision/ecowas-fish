// UploadForm.jsx
import { useState } from 'react';
import { handleUpload } from '../utils/handleUpload';
import { auth } from '../firebase/firebase';


await addDoc(collection(db, "uploads"), {
  uid: user.uid,
  countryCode: user.countryCode,
  dataType: selectedType,
  fileUrl: downloadURL,
  uploadAt: serverTimestamp(),
});

export default function UploadForm({ countryCode }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    const user = auth.currentUser;

    if (!user) return setStatus("You must be logged in.");
    if (!file) return setStatus("Please select a file.");

    setStatus("Uploading...");

    const result = await handleUpload(file, user, countryCode, "monthly-report");
    if (result.success) {
      setStatus("Upload successful!");
    } else {
      setStatus("Upload failed: " + result.error);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Upload Excel Report</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        onClick={uploadFile}
        className="mt-2 bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#f47b20]"
      >
        Upload
      </button>
      <p className="mt-2 text-sm text-gray-600">{status}</p>
    </div>
  );
}
