import React, { useState, useEffect, useRef } from "react";
import { Radar } from "react-chartjs-2";  // Import Radar directly from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";  // Register necessary components from Chart.js
import { saveAs } from "file-saver";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { loadCountryData } from "../utils/loadCountryData";  // Adjust the path if needed

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend); // Register necessary components

const EnvironmentalResilience = ({ user }) => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2022);  // Default to the latest year
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
      try {
        const json = await loadCountryData(mappedCode);
        setData(json);

        const years = [...new Set(json.map((d) => d.year))].sort((a, b) => b - a);
        setSelectedYear(years[0]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    if (user?.countryCode) {
      fetchData();
    }
  }, [user?.countryCode, mappedCode]);

  const selectedData = data.find((d) => d.year === selectedYear) || {};
  console.log("Selected Data:", selectedData);  // Log selected data to verify it's correctly set

  // Fallback to zero if the required data is not available
  const resilienceIndex = [
    "Resilience index to climate shocks",
    "Habitat health index",
  ];

  const resilienceData = resilienceIndex.map(
    (metric) => selectedData[metric] || 0
  );
  console.log("Resilience Data:", resilienceData);  // Check if the values are correctly fetched

  // If all resilience data is zero or unavailable, show fallback message
  if (resilienceData.every((value) => value === 0)) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-[#0b0b5c] mb-4 uppercase">
          Environmental Resilience – {mappedCode}
        </h2>
        <p>No data available for the selected year or resilience metrics.</p>
      </div>
    );
  }

  const radarData = {
    labels: resilienceIndex,
    datasets: [
      {
        label: `Resilience for ${mappedCode.toUpperCase()}`,
        data: resilienceData,
        borderColor: "#0b0b5c",
        backgroundColor: "rgba(11, 11, 92, 0.2)",
        pointBorderColor: "#0b0b5c",
        pointBackgroundColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    scale: {
      ticks: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const exportCSV = () => {
    const csvData = [
      {
        Report: "Environmental Resilience Report",
        Country: mappedCode.toUpperCase(),
        Indicators: resilienceIndex.join(", "),
        Exported: new Date().toLocaleDateString(),
      },
      ...[selectedYear].map((year) => {
        const row = { Year: year };
        resilienceIndex.forEach((ind) => {
          row[ind] = selectedData[ind] || 0;
        });
        return row;
      }),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `environmental_resilience_${mappedCode}.csv`);
  };

  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.setFontSize(12);
    pdf.text(`Environmental Resilience Report – ${mappedCode.toUpperCase()}`, 10, 10);
    pdf.text(`Indicators: ${resilienceIndex.join(", ")}`, 10, 18);
    pdf.text(`Exported: ${new Date().toLocaleDateString()}`, 10, 26);
    pdf.addImage(imgData, "PNG", 10, 35, 270, 120);
    pdf.save(`environmental_resilience_${mappedCode}.pdf`);
  };

  const exportPNG = async () => {
    const canvas = await html2canvas(chartRef.current);
    canvas.toBlob((blob) => {
      saveAs(blob, `environmental_resilience_${mappedCode}.png`);
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-[#0b0b5c] mb-4 uppercase">
        Environmental Resilience – {mappedCode}
      </h2>

      {/* Feature Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
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
      </div>

      {/* Chart */}
      {loading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div ref={chartRef} className="w-full h-[400px]">
          <Radar data={radarData} options={radarOptions} />
        </div>
      )}
    </div>
  );
};

export default EnvironmentalResilience;
