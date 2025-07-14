// src/client/UploadHistory.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function UploadHistory({ user }) {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user) return;
      const q = query(
        collection(db, 'uploads'),
        where('uid', '==', user.uid),
        orderBy('uploadAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploads(data);
    };

    fetchUploads();
  }, [user]);

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow rounded p-6">
      <h3 className="text-lg font-semibold text-[#0b0b5c] mb-4">📄 Upload History</h3>
      {uploads.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Data Type</th>
              <th className="p-2 text-left">Uploaded At</th>
              <th className="p-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(upload => (
              <tr key={upload.id} className="border-b">
                <td className="p-2">{upload.dataType}</td>
                <td className="p-2">{upload.uploadAt?.toDate().toLocaleString()}</td>
                <td className="p-2">
                  <a
                    href={upload.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
