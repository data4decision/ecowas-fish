import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import data from "../data/fisheriesData.json";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ClientKPI = ({ user }) => {
  if (!user || !user.countryCode) return <p>Loading...</p>;

  const userCountry = user.countryCode.charAt(0).toUpperCase() + user.countryCode.slice(1).toLowerCase();
  const countryData = data.filter(d => d.Country === userCountry);

  const indicators = Object.keys(data[0] || {}).filter(key => key !== "Country" && key !== "Year");
  const years = [...new Set(countryData.map(d => d.Year))].sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedIndicators, setSelectedIndicators] = useState([indicators[0]]);

  const handleSelectChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedIndicators(values);
  };

  const filteredEntry = countryData.find(d => d.Year === selectedYear);

  const chartData = filteredEntry
    ? [{
        country: userCountry,
        ...selectedIndicators.reduce((acc, key) => {
          acc[key] = filteredEntry[key];
          return acc;
        }, {})
      }]
    : [];

  const handleCSV = () => {
    const header = ["Country", ...selectedIndicators].join(",");
    const rows = chartData.map(row =>
      [row.country, ...selectedIndicators.map(k => row[k] ?? "-")].join(",")
    );
    const blob = new Blob([header, ...rows].join("\n"), { type: "text/csv" });
    saveAs(blob, `KPI_${userCountry}_${selectedYear}.csv`);
  };

  const handlePNG = async () => {
    const canvas = await html2canvas(document.getElementById("chart-container"));
    canvas.toBlob(blob => saveAs(blob, `KPI_${userCountry}_${selectedYear}.png`));
  };

  const handlePDF = async () => {
    const canvas = await html2canvas(document.getElementById("chart-container"));
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`KPI_${userCountry}_${selectedYear}.pdf`);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-[#0b0b5c] mb-4">KPI Analysis for {userCountry}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold">Indicators</label>
          <select
            multiple
            className="w-full p-2 border rounded h-32"
            value={selectedIndicators}
            onChange={handleSelectChange}
          >
            {indicators.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Year</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button onClick={handleCSV} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">CSV</button>
        <button onClick={handlePNG} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">PNG</button>
        <button onClick={handlePDF} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">PDF</button>
      </div>

      {/* Chart */}
      <div id="chart-container" className="bg-gray-100 p-4 rounded">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedIndicators.map((key, index) => (
              <Bar key={key} dataKey={key} name={key} fill={index % 2 === 0 ? "#0b0b5c" : "#f47b20"} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Country</th>
              {selectedIndicators.map((key) => (
                <th key={key} className="border px-3 py-2 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.country}>
                <td className="border px-3 py-2">{row.country}</td>
                {selectedIndicators.map((key) => (
                  <td key={key} className="border px-3 py-2">{row[key] ?? "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientKPI;
