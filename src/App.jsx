import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Firebase Core
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { initMessaging } from './firebase/firebase';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminSignup from './admin/AdminSignup';
import AdminDashboard from './admin/AdminDashboard';
import CreateDashboardData from './admin/CreateDashboardData';
import AdminUpload from './admin/AdminUpload';
import AdminDownloads from './admin/AdminDownloads';
import AdminTrends from './admin/AdminTrends';
import AdminKPI from './admin/AdminKPI';
import AdminReports from './admin/AdminReports';
import AdminNotifications from './admin/AdminNotifications';
import AdminHelp from './admin/AdminHelp';
import AdminSettings from './admin/AdminSettings';
import AllCountriesPage from './admin/AllCountriesPage';
import ManageSubmissions from './admin/ManageSubmissions';
import EditEntries from './admin/EditEntries';
import PushUpdates from './admin/PushUpdates';
import MasterReports from './admin/MasterReports';

// Client Pages
import ClientLogin from './client/ClientLogin';
import ClientSignup from './client/ClientSignup';
import ClientDashboard from './client/ClientDashboard';
import ClientUpload from './client/ClientUpload';
import ClientDownloads from './client/ClientDownload';
import ClientTrends from './client/ClientTrends';
import ClientKPI from './client/ClientKPI';
import ClientReportHistory from './client/ClientReportHistory';
import ClientNotifications from './client/ClientNotifications';
import ClientHelp from './client/ClientHelp';
import ClientSettings from './client/ClientSettings';

// Shared
import LandingPage from './pages/LandingPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DashboardLayout from './components/DashboardLayout';

const vapidKey = 'BANzLQZTvsath-AQDPOSDCHYHtfZoxADuAL_uksk6tT57iIBl6JXVJVPLQ2N1Z6rD5hg9kl4nigqQFZ3TZYZ3yk';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMessaging((token) => {
      console.log("FCM Token from initMessaging:", token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : {};
          const fullUser = { ...currentUser, ...userData };
          setUser(fullUser);

          try {
            const messaging = getMessaging();
            const token = await getToken(messaging, { vapidKey });
            if (token) {
              console.log('✅ FCM Token:', token);
              await setDoc(userDocRef, { fcmToken: token }, { merge: true });
            } else {
              console.warn('❌ No FCM token retrieved. Check permissions.');
            }
          } catch (err) {
            console.error('🔔 FCM Token Error:', err);
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f47b20] text-white text-xl">
        Loading...
        <span className="ml-3 animate-ping w-3 h-3 bg-white rounded-full"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/create-dashboard-data" element={user?.role === 'admin' ? <CreateDashboardData /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/downloads" element={user?.role === 'admin' ? <AdminDownloads /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/trends" element={user?.role === 'admin' ? <AdminTrends /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/kpi-analysis" element={user?.role === 'admin' ? <AdminKPI /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/reports" element={user?.role === 'admin' ? <AdminReports /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/notifications" element={user?.role === 'admin' ? <AdminNotifications /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/help" element={user?.role === 'admin' ? <AdminHelp /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/settings" element={user?.role === 'admin' ? <AdminSettings /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/all-countries" element={user?.role === 'admin' ? <AllCountriesPage /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/manage-submissions" element={user?.role === 'admin' ? <ManageSubmissions /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/edit-entries" element={user?.role === 'admin' ? <EditEntries /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/push-updates" element={user?.role === 'admin' ? <PushUpdates /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/master-reports" element={user?.role === 'admin' ? <MasterReports /> : <Navigate to="/admin/login" />} />

      {/* Client Auth + Protected Routes */}
      <Route path=":countryCode">
        {/* Public client routes */}
        <Route path="login" element={<ClientLogin />} />
        <Route path="signup" element={<ClientSignup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected client routes */}
        <Route
          element={
            user?.role === 'client' && user?.countryCode?.toLowerCase()
              ? <DashboardLayout user={user} />
              : <Navigate to={`/${user?.countryCode?.toLowerCase() || 'ng'}/login`} />
          }
        >
          <Route path="dashboard" element={<ClientDashboard user={user} />} />
          <Route path="upload" element={<ClientUpload user={user} />} />
          <Route path="downloads" element={<ClientDownloads user={user} />} />
          <Route path="trends" element={<ClientTrends user={user} />} />
          <Route path="kpi" element={<ClientKPI user={user} />} />
          <Route path="report-history" element={<ClientReportHistory user={user} />} />
          <Route path="notifications" element={<ClientNotifications user={user} />} />
          <Route path="help" element={<ClientHelp user={user} />} />
          <Route path="settings" element={<ClientSettings user={user} />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
