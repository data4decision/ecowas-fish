import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import DashboardWelcomeSection from '../components/DashboardWelcomeSection';

export default function ClientDashboard({ user }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchStats = async () => {
      try {
        const q = query(collection(db, 'uploads'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        let uploads = [];
        querySnapshot.forEach((doc) => uploads.push(doc.data()));

        if (uploads.length === 0) {
          setStats({
            totalUploads: 0,
            lastUploadDate: null,
            lastDownloadDate: null,
            monthsCovered: 0,
            reportTypes: 0,
          });
          return;
        }

        const sortedByTime = uploads.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        const uploadDates = uploads.map((item) => new Date(item.timestamp));
        const uniqueMonths = new Set(
          uploadDates.map((d) => `${d.getFullYear()}-${d.getMonth()}`)
        );

        const reportTypeSet = new Set(uploads.map((u) => u.title));

        setStats({
          totalUploads: uploads.length,
          lastUploadDate: sortedByTime[0]?.timestamp || null,
          lastDownloadDate: sortedByTime[0]?.timestamp || null, // Replace if you track downloads separately
          monthsCovered: uniqueMonths.size,
          reportTypes: reportTypeSet.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <DashboardWelcomeSection
        user={user}
        country={user?.country || user?.countryCode || 'Unknown'}
        stats={stats}
        loading={loading}
      />
    </div>
  );
}
