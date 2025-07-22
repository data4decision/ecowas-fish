import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { loadCountryData } from "../utils/loadCountryData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const indicatorGroups = {
  Economic: ["Value of Fish Trade", "Average Income of Fishers"],
  Catch: [
    "Total Fish Catch",
    "Inland Capture Production",
    "Marine Capture Production",
    "Catch per Unit Effort",
  ],
  "Post-harvest": ["Post-harvest Loss Rate", "Resilience Index to Climate Shocks"],
};

const ClientTrends = ({ user }) => {
  const [data, setData] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [loading, setLoading] = useState(true);

  const chartRef = useRef();

  const countryMap = {
    ng: "nigeria",
    gh: "ghana",
    bj: "benin",
    bf: "burkinafaso",
    sl: "sierraleone",
    gm: "gambia",
    ml: "mali",
    sn: "senegal",
    ne: "niger",
    lr: "liberia",
    ci: "cote",
    gw: "guineabissau",
    gn: "guinea",
    tg: "togo",
    cv: "cape",
  };

  const rawCode = user?.countryCode?.toLowerCase() || "ng";
  const mappedCode = countryMap[rawCode] || rawCode;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const json = await loadCountryData(mappedCode);
      setData(json);

      if (json.length > 0) {
        const keys = Object.keys(json[0]).filter(
          (k) => k.toLowerCase() !== "year" && k.toLowerCase() !== "country"
        );
        setAvailableIndicators(keys);
        setSelectedIndicators(keys.slice(0, 3));
      }
      setLoading(false);
    }

    if (user?.countryCode) {
      fetchData();
    }
  }, [user?.countryCode, mappedCode]);

  const filteredIndicators =
    selectedGroup === "All"
      ? availableIndicators
      : indicatorGroups[selectedGroup] || [];

  const years = [...new Set(data.map((d) => d.Year))].filter(
    (y) => y >= yearRange[0] && y <= yearRange[1]
  );

  const chartData = {
    labels: years,
    datasets: selectedIndicators.map((indicator, idx) => ({
      label: indicator,
      data: years.map(
        (year) => data.find((d) => d.Year === year)?.[indicator] ?? 0
      ),
      borderColor: `hsl(${(idx * 47) % 360}, 80%, 50%)`,
      backgroundColor: `hsl(${(idx * 47) % 360}, 80%, 70%)`,
      fill: false,
      tension: 0.4,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  const handleGroupToggle = (groupName) => {
    const groupIndicators = indicatorGroups[groupName];
    setSelectedIndicators((prev) => {
      const isActive = groupIndicators.every((ind) => prev.includes(ind));
      return isActive
        ? prev.filter((ind) => !groupIndicators.includes(ind))
        : [...new Set([...prev, ...groupIndicators])];
    });
  };

  const exportCSV = () => {
    const exportData = [
      {
        Report: "Fisheries Trends Report",
        Country: mappedCode.toUpperCase(),
        Indicators: selectedIndicators.join(", "),
        Exported: new Date().toLocaleDateString(),
      },
      ...years.map((year) => {
        const row = { Year: year };
        selectedIndicators.forEach((ind) => {
          row[ind] = data.find((d) => d.Year === year)?.[ind] ?? 0;
        });
        return row;
      }),
    ];

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `fisheries_trends_${mappedCode}.csv`);
  };

  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.setFontSize(12);
    pdf.text(`Fisheries Trends Report – ${mappedCode.toUpperCase()}`, 10, 10);
    pdf.text(`Indicators: ${selectedIndicators.join(", ")}`, 10, 18);
    pdf.text(`Exported: ${new Date().toLocaleDateString()}`, 10, 26);
    pdf.addImage(imgData, "PNG", 10, 35, 270, 120);
    pdf.save(`fisheries_trends_${mappedCode}.pdf`);
  };

  const exportPNG = async () => {
    const canvas = await html2canvas(chartRef.current);
    canvas.toBlob((blob) => {
      saveAs(blob, `fisheries_trends_${mappedCode}.png`);
    });
  };

  const resetFilters = () => {
    setSelectedIndicators(availableIndicators.slice(0, 3));
    setYearRange([2000, 2024]);
    setSelectedGroup("All");
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-[#0b0b5c] mb-4 uppercase">
        Yearly Trends – {mappedCode}
      </h2>

      {/* Feature Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(indicatorGroups).map((group) => (
          <button
            key={group}
            onClick={() => handleGroupToggle(group)}
            className="bg-blue-100 hover:bg-blue-200 text-sm font-medium px-3 py-1 rounded"
          >
            Toggle {group}
          </button>
        ))}
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={exportPNG}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
        >
          Download PNG
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold">Indicator Category</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="All">All</option>
            {Object.keys(indicatorGroups).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <label className="text-sm font-semibold mt-2 block">Indicators</label>
          <select
            multiple
            value={selectedIndicators}
            onChange={(e) =>
              setSelectedIndicators(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full border p-2 rounded h-32"
          >
            {filteredIndicators.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Year Range</label>
          <input
            type="range"
            min="2000"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => setYearRange([2000, +e.target.value])}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Showing years: 2000 to {yearRange[1]}
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div ref={chartRef} className="w-full h-[150px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ClientTrends;
