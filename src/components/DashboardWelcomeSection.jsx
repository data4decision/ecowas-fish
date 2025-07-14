import React from 'react';
import {
  CloudUpload,
  CloudDownload,
  CalendarDays,
  FileText
} from 'lucide-react';

export default function DashboardWelcomeSection({
  user,
  country,
  stats,
  loading
}) {
  const {
    lastUploadDate,
    lastDownloadDate,
    totalUploads,
    monthsCovered,
    reportTypes
  } = stats || {};

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-white rounded shadow-md">
      {/* Welcome Text */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0b0b5c]">
          Welcome, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
👋
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Dashboard for <span className="font-medium text-[#f47b20]">{country}</span>
        </p>
      </div>

      {/* Upload/Download Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded">
          <CloudUpload className="text-[#f47b20]" size={20} />
          <div>
            <p className="text-sm text-gray-500">Last Upload</p>
            <p className="font-medium text-[#0b0b5c]">
              {loading ? 'Loading...' : formatDate(lastUploadDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded">
          <CloudDownload className="text-[#f47b20]" size={20} />
          <div>
            <p className="text-sm text-gray-500">Last Download</p>
            <p className="font-medium text-[#0b0b5c]">
              {loading ? 'Loading...' : formatDate(lastDownloadDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CloudUpload size={22} className="text-white" />}
          label="Total Uploads"
          value={loading ? '...' : totalUploads}
        />
        <StatCard
          icon={<CalendarDays size={22} className="text-white" />}
          label="Months Covered"
          value={loading ? '...' : monthsCovered}
        />
        <StatCard
          icon={<FileText size={22} className="text-white" />}
          label="Report Types"
          value={loading ? '...' : reportTypes}
        />
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#0b0b5c] text-white rounded shadow-sm">
      <div className="w-10 h-10 bg-[#f47b20] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
