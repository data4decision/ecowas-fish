import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, storage, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ClientUploadPage() {
const [user, setUser] = useState(null);
const [file, setFile] = useState(null);
const [dataType, setDataType] = useState('monthly-report');
const [message, setMessage] = useState('');
const [uploadHistory, setUploadHistory] = useState([]);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
if (currentUser) {
setUser(currentUser);
fetchUploads(currentUser.uid);
}
});
return () => unsubscribe();
}, []);

const fetchUploads = async (uid) => {
const q = query(
collection(db, 'uploads'),
where('uid', '==', uid),
orderBy('uploadAt', 'desc')
);
const snapshot = await getDocs(q);
const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setUploadHistory(data);
};

const handleFileChange = (e) => {
setFile(e.target.files[0]);
};

const handleUpload = async (e) => {
e.preventDefault();
setMessage('');
if (!file || !user) {
setMessage('Please select a file and login first.');
return;
}
if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
setMessage('❌ Only Excel files are allowed.');
return;
}
try {
  const countryCode = localStorage.getItem('countryCode') || 'NG';
  const storagePath = `uploads/${countryCode}/${user.uid}/${file.name}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'uploads'), {
    uid: user.uid,
    countryCode,
    fileUrl: url,
    dataType,
    uploadAt: new Date(),
    fileName: file.name,
  });

  setMessage('✅ File uploaded successfully!');
  setFile(null);
  fetchUploads(user.uid);
} catch (err) {
  console.error(err);
  setMessage('❌ Upload failed.');
}
};

return (
<div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
<h2 className="text-xl font-bold mb-4 text-[#0b0b5c]">📤 Upload Monthly Report</h2>
<form onSubmit={handleUpload} className="space-y-4">
<div>
<label className="block font-medium mb-1">Select Excel File:</label>
<input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="border px-3 py-2 w-full rounded" />
</div>
<div>
<label className="block font-medium mb-1">Data Type:</label>
<select
value={dataType}
onChange={(e) => setDataType(e.target.value)}
className="border px-3 py-2 w-full rounded"
>
<option value="monthly-report">Monthly Report</option>
<option value="annual-summary">Annual Summary</option>
</select>
</div>
<button type="submit" className="bg-[#f47b20] text-white px-4 py-2 rounded hover:opacity-90">
Upload
</button>
{message && <p className="mt-2 text-sm">{message}</p>}
</form>
  {/* Upload History */}
  <div className="mt-10">
    <h3 className="text-lg font-semibold text-[#0b0b5c] mb-3">📄 Upload History</h3>
    {uploadHistory.length === 0 ? (
      <p>No uploads yet.</p>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Data Type</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">File</th>
          </tr>
        </thead>
        <tbody>
          {uploadHistory.map((upload) => (
            <tr key={upload.id} className="border-b">
              <td className="p-2">{upload.dataType}</td>
              <td className="p-2">{upload.uploadAt?.toDate().toLocaleString()}</td>
              <td className="p-2">
                <a href={upload.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
);
}