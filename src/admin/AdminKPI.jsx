import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowUpRight, ArrowDownRight, Play, Pause } from "lucide-react";
import AdminLayout from "./AdminLayout";
import fisheriesData from "../data/fisheriesData.json";

const allIndicators = Object.keys(fisheriesData[0]).filter(
  (key) => key !== "Country" && key !== "Year" && key !== "Region"
);
const years = Array.from(new Set(fisheriesData.map((d) => d.Year))).sort((a, b) => a - b);
const countries = Array.from(new Set(fisheriesData.map((d) => d.Country))).sort();

export default function AdminKPI({ user }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(allIndicators[0]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([countries[0]]);
  const [yearIndex, setYearIndex] = useState(years.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const playTrend = () => {
    setIsPlaying(true);
    setYearIndex(0);
    intervalRef.current = setInterval(() => {
      setYearIndex((prev) => {
        if (prev < years.length - 1) return prev + 1;
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        return prev;
      });
    }, 700);
  };

  const pauseTrend = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const getChartData = () => {
    const currentYear = years[yearIndex];
    if (compareMode) {
      return years.map((year) => {
        const entry = { year };
        selectedCountries.forEach((country) => {
          const record = fisheriesData.find((d) => d.Year === year && d.Country === country);
          entry[country] = record ? record[selectedIndicator] : null;
        });
        return entry;
      });
    } else {
      return fisheriesData
        .filter((d) => d.Country === selectedCountry && d.Year <= currentYear)
        .map((d) => ({ year: d.Year, value: d[selectedIndicator] }));
    }
  };

  const getTrendArrow = () => {
    const filtered = fisheriesData.filter(
      (d) => d.Country === selectedCountry && d[selectedIndicator] != null
    );
    if (filtered.length < 2) return null;
    const start = filtered[0][selectedIndicator];
    const end = filtered[filtered.length - 1][selectedIndicator];
    if (end > start) return <ArrowUpRight className="text-green-600" />;
    if (end < start) return <ArrowDownRight className="text-red-600" />;
    return null;
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("kpi-chart-section");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
    pdf.save("kpi-trends.pdf");
  };

  const chartData = getChartData();
  const currentYear = years[yearIndex];

  return (
    <AdminLayout user={user}>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Indicator</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
            >
              {allIndicators.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {compareMode ? "Select Countries" : "Select Country"}
            </label>
            {!compareMode ? (
              <select
                className="w-full p-2 border rounded"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <div className="h-32 overflow-y-auto border p-2 rounded">
                {countries.map((c) => (
                  <label key={c} className="block text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(c)}
                      onChange={() => toggleCountry(c)}
                      className="mr-2"
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="mr-2"
              />
              Compare Multiple Countries
            </label>
            <div className="flex gap-2">
              <button
                onClick={isPlaying ? pauseTrend : playTrend}
                className="px-3 py-2 bg-[#0b0b5c] text-white text-sm rounded"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 bg-[#f47b20] text-white text-sm rounded"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div id="kpi-chart-section" className="bg-gray-50 p-4 rounded">
          {!compareMode && (
            <div className="mb-2 flex justify-between items-center">
              <h4 className="font-medium text-gray-700">
                {selectedCountry} (up to {currentYear})
              </h4>
              {getTrendArrow()}
            </div>
          )}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {!compareMode ? (
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={selectedIndicator}
                    stroke="#0b0b5c"
                    strokeWidth={2}
                    dot={false}
                  />
                ) : (
                  selectedCountries.map((country, i) => (
                    <Line
                      key={country}
                      type="monotone"
                      dataKey={country}
                      name={country}
                      stroke={["#0b0b5c", "#f47b20", "#82ca9d", "#8884d8"][i % 4]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}