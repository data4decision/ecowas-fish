import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import DashboardWelcomeSection from './DashboardWelcomeSection';

export default function DashboardWrapper({ user }) {
  const { countryCode } = useParams(); // e.g. 'ng'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrCreateDashboardData = async () => {
      try {
        const docRef = doc(db, 'dashboardData', `${countryCode}-overview`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats({
            lastUploadDate: data.lastUploadDate || null,
            lastDownloadDate: data.lastDownloadDate || null,
            totalUploads: data.totalUploads || 0,
            monthsCovered: data.monthsCovered || 'N/A',
            reportTypes: Array.isArray(data.reportTypes) ? data.reportTypes.join(', ') : 'N/A',
          });
        } else {
          // 🔧 Automatically create the doc with default values
          const defaultData = {
            lastUploadDate: null,
            lastDownloadDate: null,
            totalUploads: 0,
            monthsCovered: 'N/A',
            reportTypes: [],
          };
          await setDoc(docRef, defaultData);

          setStats({
            lastUploadDate: null,
            lastDownloadDate: null,
            totalUploads: 0,
            monthsCovered: 'N/A',
            reportTypes: 'No reports yet',
          });
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.country?.toLowerCase() === countryCode) {
      fetchOrCreateDashboardData();
    } else {
      setError('You do not have permission to view dashboard data for this country.');
      setLoading(false);
    }
  }, [countryCode, user]);

  if (loading) {
    return <div className="text-center mt-6 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>;
  }

  return <DashboardWelcomeSection user={user} country={countryCode.toUpperCase()} stats={stats} loading={loading} />;
}
