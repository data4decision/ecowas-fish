import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


import AdminLogin from './admin/AdminLogin';
import AdminSignup from './admin/AdminSignup';
import AdminDashboard from './admin/AdminDashboard';
import ClientLogin from './client/ClientLogin';
import ClientSignup from './client/ClientSignup';
import ClientDashboard from './client/ClientDashboard';
import LandingPage from './pages/LandingPage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreateDashboardData from './admin/CreateDashboardData';
import DashboardWrapper from './components/DashboardWrapper';

// 🆕 Import Admin Feature Pages
import AllCountriesPage from './admin/AllCountriesPage';
import ManageSubmissions from './admin/ManageSubmissions';
import EditEntries from './admin/EditEntries';
import PushUpdates from './admin/PushUpdates';
import MasterReports from './admin/MasterReports';

// 🆕 Import Full Admin Pages (for Sidebar Links)
import AdminUpload from './admin/AdminUpload';
import AdminDownloads from './admin/AdminDownloads';
import AdminTrends from './admin/AdminTrends';
import AdminKPI from './admin/AdminKPI';
import AdminReports from './admin/AdminReports';
import AdminNotifications from './admin/AdminNotifications';
import AdminHelp from './admin/AdminHelp';
import AdminSettings from './admin/AdminSettings';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({ ...currentUser, ...userData });
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
      {/* 🌍 Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 🔐 Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* 🧑‍💼 Admin Dashboard + Core Features */}
      <Route
        path="/admin/dashboard"
        element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/admin/login" />}
      />
      <Route
        path="/admin/create-dashboard-data"
        element={user?.role === 'admin' ? <CreateDashboardData /> : <Navigate to="/admin/login" />}
      />

      {/* 📊 Admin Sidebar Pages */}
      <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/downloads" element={user?.role === 'admin' ? <AdminDownloads /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/trends" element={user?.role === 'admin' ? <AdminTrends /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/kpi-analysis" element={user?.role === 'admin' ? <AdminKPI /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/reports" element={user?.role === 'admin' ? <AdminReports /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/notifications" element={user?.role === 'admin' ? <AdminNotifications /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/help" element={user?.role === 'admin' ? <AdminHelp /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/settings" element={user?.role === 'admin' ? <AdminSettings /> : <Navigate to="/admin/login" />} />

      {/* 🛠️ Admin Functional Pages */}
      <Route path="/admin/all-countries" element={user?.role === 'admin' ? <AllCountriesPage /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/manage-submissions" element={user?.role === 'admin' ? <ManageSubmissions /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/edit-entries" element={user?.role === 'admin' ? <EditEntries /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/push-updates" element={user?.role === 'admin' ? <PushUpdates /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/master-reports" element={user?.role === 'admin' ? <MasterReports /> : <Navigate to="/admin/login" />} />

      {/* 🌐 Client Country-Specific Routes */}
      <Route path=":countryCode">
        <Route path="login" element={<ClientLogin />} />
        <Route path="signup" element={<ClientSignup />} />
        <Route
          path="dashboard"
          element={
            user?.role === 'client' && user?.country?.toLowerCase() === user?.country?.toLowerCase()
              ? <ClientDashboard user={user} />
              : <Navigate to={`/${user?.country?.toLowerCase() || 'ng'}/login`} />
          }
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* 🧭 General Dashboard Route for Clients */}
      <Route
        path="dashboard"
        element={
          user?.role === 'client'
            ? <DashboardWrapper user={user} />
            : <Navigate to={`/${user?.country?.toLowerCase() || 'ng'}/login`} />
        }
      />

      {/* 🚧 Catch-All: Redirect unknown routes to Landing */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
