// src/components/OverviewCards.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function OverviewCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalCountries: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const reportsSnapshot = await getDocs(collection(db, 'reports'));
        const countriesSnapshot = await getDocs(collection(db, 'countries'));

        setStats({
          totalUsers: usersSnapshot.size,
          totalReports: reportsSnapshot.size,
          totalCountries: countriesSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Card title="Total Users" count={stats.totalUsers} />
      <Card title="Total Reports" count={stats.totalReports} />
      <Card title="Countries Covered" count={stats.totalCountries} />
    </div>
  );
}

function Card({ title, count }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-[#0b0b5c]">{count}</p>
    </div>
  );
}
