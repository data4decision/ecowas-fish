
import React from "react";

export default function DashboardFilters({ countries, indicators, yearRange, filters, onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-semibold text-lg mb-4">Advanced Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Selector */}
        <div>
          <label className="block mb-1">Select Countries</label>
          <select
            className="w-full border rounded p-2"
            value={filters.country}
            onChange={(e) => onFilterChange("country", e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div>
          <label className="block mb-1">Select Year</label>
          <input
            type="range"
            min={yearRange[0]}
            max={yearRange[1]}
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-center mt-1">Year: {filters.year}</p>
        </div>

        {/* Indicator Selector */}
        <div>
          <label className="block mb-1">Select Indicator</label>
          <select
            className="w-full border rounded p-2"
            value={filters.indicator}
            onChange={(e) => onFilterChange("indicator", e.target.value)}
          >
            <option value="">All Indicators</option>
            {indicators.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
