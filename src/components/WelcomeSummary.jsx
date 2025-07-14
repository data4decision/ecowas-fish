import React from 'react';

export default function WelcomeSummaryCard({ user, uploadHistory, reportTypes, loading }) {
  if (loading) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-white animate-pulse text-center">
        <p className="text-lg font-semibold text-gray-500">Loading dashboard summary...</p>
      </div>
    );
  }

  if (!user || !uploadHistory) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-red-100 text-red-700">
        Unable to load dashboard summary. Please check your access or try again.
      </div>
    );
  }

  const { displayName, country } = user;
  const { uploads = [], lastUploadDate, lastDownloadDate } = uploadHistory;

  const formattedUploadDate = lastUploadDate
    ? new Date(lastUploadDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const formattedDownloadDate = lastDownloadDate
    ? new Date(lastDownloadDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const totalUploads = uploads.length;

  const years = uploads.map((item) => new Date(item.timestamp).getFullYear());
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;
  const yearRange = minYear && maxYear ? `${minYear}–${maxYear}` : 'N/A';

  const reportTypeList = reportTypes?.length > 0 ? reportTypes.join(', ') : 'None';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Welcome Header */}
      <h2 className="text-xl md:text-2xl font-bold text-[#0b0b5c] mb-2">
        Welcome, {displayName || 'User'} ({country || 'Unknown'})
      </h2>

      {/* Dates */}
      <div className="text-sm text-gray-600 mb-4">
        <p>Last upload: <span className="font-medium">{formattedUploadDate}</span></p>
        <p>Last download: <span className="font-medium">{formattedDownloadDate}</span></p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Total Uploads */}
        <div className="bg-[#f4f4f4] p-4 rounded shadow-sm text-center">
          <p className="text-sm text-gray-500">Total Uploads</p>
          <p className="text-lg font-bold text-[#0b0b5c]">{totalUploads}</p>
        </div>

        {/* Year Range */}
        <div className="bg-[#f4f4f4] p-4 rounded shadow-sm text-center">
          <p className="text-sm text-gray-500">Years Covered</p>
          <p className="text-lg font-bold text-[#0b0b5c]">{yearRange}</p>
        </div>

        {/* Report Types */}
        <div className="bg-[#f4f4f4] p-4 rounded shadow-sm text-center">
          <p className="text-sm text-gray-500">Report Types</p>
          <p className="text-sm font-medium text-[#0b0b5c]">{reportTypeList}</p>
        </div>
      </div>
    </div>
  );
}
