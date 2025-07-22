// src/components/YearlyTrendsChart.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import nigeriaData from "../data/nigeria.json"; // Change dynamically based on country if needed

const YearlyTrendsChart = ({ countryName = "Nigeria" }) => {
  const [data, setData] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const allIndicators = Object.keys(nigeriaData[0] || {}).filter(k => k !== "Year" && k !== "Country");

  useEffect(() => {
    // Filter by country (if mixed files are used, but in your case, it's already isolated)
    const sortedData = [...nigeriaData].sort((a, b) => a.Year - b.Year);
    setData(sortedData);
  }, []);

  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedIndicators(values);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[#0b0b5c]">{countryName} - Yearly Trends</h2>

      <label className="block text-sm font-semibold mb-2">Select Indicators</label>
      <select
        multiple
        value={selectedIndicators}
        onChange={handleChange}
        className="w-full border p-2 h-40 rounded mb-4"
      >
        {allIndicators.map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedIndicators.map((indicator, i) => (
            <Line
              key={indicator}
              type="monotone"
              dataKey={indicator}
              stroke={i % 2 === 0 ? "#0b0b5c" : "#f47b20"}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyTrendsChart;
