import React, { useState } from "react";

import fisheriesData from "../data/fisheriesData.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Extract indicators from data
const allIndicators = Object.keys(fisheriesData[0]).filter(
  (key) => key !== "Country" && key !== "Year" && key !== "Region"
);

export default function AdvancedComparison() {
  const years = [...new Set(fisheriesData.map((d) => d.Year))].sort((a, b) => b - a);
  const regions = [...new Set(fisheriesData.map((d) => d.Region))];
  const countries = [...new Set(fisheriesData.map((d) => d.Country))];

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedIndicators, setSelectedIndicators] = useState([allIndicators[0]]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [hideMissing, setHideMissing] = useState(false);

  const toggleIndicator = (indicator) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator)
        ? prev.filter((i) => i !== indicator)
        : [...prev, indicator]
    );
  };

  const filteredData = fisheriesData.filter((item) => {
    return (
      item.Year === selectedYear &&
      (!selectedRegion || item.Region === selectedRegion)
    );
  });

  const chartData = countries
    .map((country) => {
      const record = filteredData.find((d) => d.Country === country);
      if (!record) return { country };
      const entry = { country };
      selectedIndicators.forEach((key) => {
        entry[key] = record[key] ?? null;
      });
      return entry;
    })
    .filter((d) => !hideMissing || selectedIndicators.some((key) => d[key] !== null));

  const handleDownloadCSV = () => {
    const header = ["Country", ...selectedIndicators].join(",");
    const rows = chartData.map((row) =>
      [row.country, ...selectedIndicators.map((key) => row[key] ?? "N/A")].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `Advanced_Comparison_${selectedYear}.csv`);
  };

  const handleExportPNG = async () => {
    const chart = document.getElementById("advanced-chart");
    if (!chart) return;
    const canvas = await html2canvas(chart, { scale: 2 });
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `Advanced_Comparison_${selectedYear}.png`);
    });
  };

  const handleExportPDF = async () => {
    const chart = document.getElementById("advanced-chart");
    if (!chart) return;
    const canvas = await html2canvas(chart, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save(`Advanced_Comparison_${selectedYear}.pdf`);
  };

  return (
   
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-[#0b0b5c]">
          Advanced Indicator Comparison
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
            <select
              className="w-full border rounded p-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Region (Optional)</label>
            <select
              className="w-full border rounded p-2"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={hideMissing}
                onChange={(e) => setHideMissing(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Hide Missing Values</span>
            </label>
          </div>
        </div>

        {/* Indicator Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Indicators</label>
          <div className="border rounded p-3 max-h-40 overflow-y-scroll bg-gray-50">
            {allIndicators.map((ind) => (
              <label key={ind} className="block text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedIndicators.includes(ind)}
                  onChange={() => toggleIndicator(ind)}
                  className="mr-2"
                />
                {ind}
              </label>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-[#0b0b5c] text-white rounded hover:bg-[#202073]"
          >
            Download CSV
          </button>
          <button
            onClick={handleExportPNG}
            className="px-4 py-2 bg-[#f47b20] text-white rounded hover:bg-[#d06618]"
          >
            Export PNG
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>

        {/* Chart */}
        <div id="advanced-chart" className="w-full">
          <div className="w-full h-[400px] sm:h-[500px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="country"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {selectedIndicators.map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={key}
                    fill={
                      ["#0b0b5c", "#f47b20", "#8884d8", "#82ca9d", "#ffc658"][i % 5]
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    
  );
}
