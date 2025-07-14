
import {
  CloudUpload, CloudDownload, CalendarDays, FileText,
} from 'lucide-react';
import { db } from '../firebase/firebase'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardHeader({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from Firestore
  useEffect(() => {
    if (!user?.countryCode) return;

    const fetchStats = async () => {
      try {
        const statsRef = doc(db, 'dashboardStats', user.countryCode.toLowerCase());
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          setStats(statsSnap.data());
        } else {
          setStats({
            lastUpload: null,
            lastDownload: null,
            totalUploads: 0,
            monthsCovered: 0,
            reportTypes: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const fallback = (
    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
  );

  return (
    <section className="w-full bg-white shadow rounded-md p-6 mb-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0B0B5C]">
          {loading ? fallback : `Welcome, ${user?.name || 'User'}!`}
        </h2>
        <p className="text-sm text-gray-600">
          {loading
            ? fallback
            : `Here’s your annual overview for ${user?.country || 'your country'}.`}
        </p>
      </div>

      {/* Upload & Download Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#F7F7F7] border-l-4 border-[#F47B20] px-4 py-3 rounded">
          <p className="text-sm font-medium text-[#0B0B5C] flex items-center gap-2">
            <CloudUpload size={18} className="text-[#F47B20]" />
            Last Data Upload
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {loading ? fallback : stats?.lastUpload || 'No upload yet'}
          </p>
        </div>
        <div className="bg-[#F7F7F7] border-l-4 border-[#0B0B5C] px-4 py-3 rounded">
          <p className="text-sm font-medium text-[#0B0B5C] flex items-center gap-2">
            <CloudDownload size={18} className="text-[#0B0B5C]" />
            Last Data Download
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {loading ? fallback : stats?.lastDownload || 'No download yet'}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<CloudUpload size={24} />}
          label="Total Uploads"
          value={stats?.totalUploads ?? 0}
          loading={loading}
          color="#F47B20"
        />
        <StatCard
          icon={<CalendarDays size={24} />}
          label="Months Covered"
          value={stats?.monthsCovered ?? 0}
          loading={loading}
          color="#0B0B5C"
        />
        <StatCard
          icon={<FileText size={24} />}
          label="Report Types"
          value={stats?.reportTypes ?? 0}
          loading={loading}
          color="#F47B20"
        />
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, loading, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex items-center gap-4">
      <div className={`p-2 rounded-full`} style={{ backgroundColor: `${color}1A`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold text-[#0B0B5C]">
          {loading ? '...' : value}
        </p>
      </div>
    </div>
  );
}
