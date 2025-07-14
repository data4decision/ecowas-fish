import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function CreateDashboardData() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('ng'); // Default to 'ng'
  const [docId, setDocId] = useState('ng-dashboard'); // Your preferred document ID

  const handleCreate = async () => {
    setError('');
    setMessage('');

    try {
      await setDoc(doc(db, 'dashboardData', docId), {
        countryCode: countryCode.toLowerCase(),
        title: `Dashboard for ${countryCode.toUpperCase()}`,
        reportTypes: ['Annual Report', 'Q1 Summary', 'Catch Records'],
        createdAt: serverTimestamp(),
        notes: 'Auto-generated for demo access'
      });

      setMessage(`✅ dashboardData/${docId} created successfully`);
    } catch (err) {
      setError(`❌ Failed to create document: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Create Dashboard Data</h2>

      <input
        type="text"
        placeholder="Country Code (e.g. ng)"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value.trim())}
        className="border p-2 rounded w-full mb-2"
      />

      <input
        type="text"
        placeholder="Document ID (e.g. ng-dashboard)"
        value={docId}
        onChange={(e) => setDocId(e.target.value.trim())}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handleCreate}
        className="bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#f47b20]"
      >
        Create Dashboard Document
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
