import React from 'react';

export default function WelcomeHeader({ user, loading }) {
  if (loading) {
    return (
      <div className="p-4 rounded-md bg-gray-100 text-gray-500 animate-pulse">
        Loading welcome message...
      </div>
    );
  }

  if (!user || !user.displayName || !user.country) {
    return (
      <div className="p-4 rounded-md bg-red-100 text-red-700">
        Unable to load user details. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0b0b5c]">
        Welcome, {user.displayName} ({user.country})
      </h1>
    </div>
  );
}
