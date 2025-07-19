import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsonData from "../data/fisheriesData.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ClientKPI = ({ user }) => {
  const [countryData, setCountryData] = useState([]);
  const [years, setYears] = useState([]);
  const [kpiOptions, setKpiOptions] = useState([]);
  const [selectedKPIs, setSelectedKPIs] = useState([]);

  useEffect(() => {
    if (!user?.countryCode) return;
    const countryCode = user.countryCode.toLowerCase();

    const filtered = jsonData.filter(
      (item) => item.country?.toLowerCase() === countryCode
    );
    setCountryData(filtered);

    const uniqueYears = [...new Set(filtered.map((d) => d.year))].sort();
    setYears(uniqueYears);

    // Get all KPI fields except 'country' and 'year'
    const sample = filtered[0] || {};
    const kpiFields = Object.keys(sample).filter(
      (key) => !["country", "year"].includes(key)
    );
    setKpiOptions(kpiFields);
  }, [user]);

  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedKPIs(selected);
  };

  const chartData = {
    labels: years,
    datasets: selectedKPIs.map((kpi, i) => ({
      label: kpi,
      data: years.map((yr) => {
        const entry = countryData.find((d) => d.year === yr);
        return entry ? Number(entry[kpi]) || 0 : 0;
      }),
      borderColor: `hsl(${i * 60}, 70%, 45%)`,
      backgroundColor: `hsl(${i * 60}, 70%, 75%)`,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "KPI Analysis" },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-[#0b0b5c] mb-4">KPI Analysis</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select KPI Indicators:</label>
        <select
          multiple
          className="w-full border p-2 rounded"
          onChange={handleSelectChange}
        >
          {kpiOptions.map((kpi) => (
            <option key={kpi} value={kpi}>
              {kpi}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">Hold Ctrl or Cmd to select multiple.</p>
      </div>

      {selectedKPIs.length > 0 ? (
        <Line options={chartOptions} data={chartData} height={400} />
      ) : (
        <p className="text-gray-600">Please select KPI(s) to display chart.</p>
      )}
    </div>
  );
};

export default ClientKPI;
