
import React from 'react';

export default function OverviewCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center w-full sm:w-1/3">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-[#0b0b5c]">{value}</p>
    </div>
  );
}
