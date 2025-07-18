import { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import axios from 'axios';
import AdminLayout from './AdminLayout';

export default function AdminNotifications({ user }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [country, setCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendNotification = async () => {
    setLoading(true);
    setMessage('');

    try {
      let tokens = [];

      const clientsRef = collection(db, 'clients'); // 🔁 Replace 'clients' with your preferred collection
      const q = country === 'all'
        ? query(clientsRef)
        : query(clientsRef, where('country', '==', country));

      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.fcmToken) tokens.push(data.fcmToken);
      });

      if (tokens.length === 0) {
        setMessage('🚫 No users found with FCM tokens.');
        setLoading(false);
        return;
      }

      for (let token of tokens) {
        await axios.post('http://localhost:5000/send-notification', {
          token,
          title,
          body,
        });
      }

      setMessage(`✅ Notification sent to ${tokens.length} user(s).`);
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage('❌ Error sending notification');
    }

    setLoading(false);
  };

  return (
    <AdminLayout user={user}>
      <h2 className="text-lg font-bold mb-4">Push Notifications</h2>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <label className="block mb-2">
          Target Country:
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="all">All Countries</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Senegal">Senegal</option>
            <option value="Togo">Togo</option>
            {/* 🔁 Add all 15 ECOWAS countries here */}
          </select>
        </label>

        <label className="block mt-4 mb-2">
          Notification Title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            placeholder="e.g. New Report Available"
          />
        </label>

        <label className="block mt-4 mb-2">
          Notification Body:
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            rows={4}
            placeholder="Write your message here..."
          ></textarea>
        </label>

        <button
          onClick={sendNotification}
          disabled={loading}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Sending...' : 'Send Notification'}
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </AdminLayout>
  );
}
