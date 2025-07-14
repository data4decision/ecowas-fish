// src/client/ClientUploadForm.jsx
import React, { useState } from 'react';
import { auth, storage, db } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ClientUploadForm({ user }) {
  const [file, setFile] = useState(null);
  const [dataType, setDataType] = useState('monthly-report');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!file || !user) {
      setMessage('Please select a file and make sure you are logged in.');
      return;
    }

    try {
      setUploading(true);
      const storagePath = `uploads/${user.countryCode}/${user.uid}/${file.name}`;
      const fileRef = ref(storage, storagePath);
      
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const metadataRef = doc(db, 'uploads', `${user.uid}-${Date.now()}`);
      await setDoc(metadataRef, {
        uid: user.uid,
        countryCode: user.countryCode,
        dataType,
        fileUrl,
        uploadAt: serverTimestamp(),
      });

      setMessage('✅ File uploaded successfully!');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-[#0b0b5c]">Upload Fisheries Data</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Data Type</label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="monthly-report">Monthly Report</option>
            <option value="annual-summary">Annual Summary</option>
            <option value="landing-data">Landing Data</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Select Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-[#f47b20] text-white px-6 py-2 rounded hover:bg-orange-600 transition"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
