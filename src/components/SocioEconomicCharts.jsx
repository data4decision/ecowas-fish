import React, { useEffect, useState } from "react";
import { loadCountryData } from "../utils/loadCountryData";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv"; // Ensure this import is added

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

const SocioEconomicCharts = ({ user }) => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const rawCode = user?.countryCode?.toLowerCase()?.trim() || "ng";
  const mappedCode = countryMap[rawCode] || rawCode;

  useEffect(() => {
    async function fetchData() {
      const json = await loadCountryData(mappedCode);
      console.log("Fetched Data:", json); // Debugging line to check fetched data

      setData(json);

      const years = [...new Set(json.map((d) => d.Year))].sort((a, b) => b - a);
      setSelectedYear(years[0]);
    }

    if (user?.countryCode) {
      fetchData();
    }
  }, [user?.countryCode, mappedCode]);

  const selectedData = data.find((d) => d.Year === selectedYear) || {};
  console.log("Selected Data:", selectedData); // Debugging line to check selected data

  const fisherTypes = [
    "Number of artisanal fishers",
    "Number of industrial fishers",
    "Number of inland fishers"
  ];

  const totalFishers = fisherTypes.reduce((sum, key) => sum + (selectedData[key] || 0), 0);

  const pieFields = [
    { key: "Gender equity in fisheries leadership", label: "Gender Equity" },
    { key: "% of women in post-harvest roles", label: "Women in Post-Harvest" },
    { key: "Participation of youth in fishing sector", label: "Youth Participation" },
    { key: "Access to credit/loans", label: "Access to Credit" },
    { key: "Level of literacy among fishers", label: "Fisher Literacy" }
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Socio-Economic Report for ${mappedCode.toUpperCase()} - ${selectedYear}`, 10, 10);
    autoTable(doc, {
      head: [["Indicator", "Value"]],
      body: [
        ...fisherTypes.map(k => [k, selectedData[k] || 0]),
        ...pieFields.map(({ key }) => [key, selectedData[key] || 0])
      ]
    });
    doc.save(`Socio-Economic_${mappedCode}_${selectedYear}.pdf`);
  };

  const csvData = [
    ["Indicator", "Value"],
    ...fisherTypes.map(k => [k, selectedData[k] || 0]),
    ...pieFields.map(({ key }) => [key, selectedData[key] || 0])
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#0b0b5c]">Socio-Economic Overview – {mappedCode}</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border px-3 py-1 rounded"
        >
          {[...new Set(data.map((d) => d.Year))].sort((a, b) => b - a).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Fisher Types (Total: {totalFishers})</h3>
        <Bar
          data={{
            labels: fisherTypes,
            datasets: [{
              label: "Number of Fishers",
              data: fisherTypes.map((key) => selectedData[key] || 0),
              backgroundColor: "#0b0b5c"
            }]
          }}
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pieFields.map(({ key, label }) => {
          const value = selectedData[key] || 0;
          const pieData = {
            labels: [label, "Others"],
            datasets: [{
              data: [value, 100 - value],
              backgroundColor: ["#0b0b5c", "#e2e8f0"]
            }]
          };
          return (
            <div key={key} className="bg-white p-4 rounded shadow">
              <h4 className="text-sm font-semibold mb-1">{label}</h4>
              <Pie data={pieData} />
              <p className="text-xs text-center mt-2">{value}%</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 bg-blue-700 text-white rounded">
          <CSVLink data={csvData} filename={`Socio-Economic_${mappedCode}_${selectedYear}.csv`}>Export CSV</CSVLink>
        </button>
        <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded">Export PDF</button>
      </div>
    </div>
  );
};

export default SocioEconomicCharts;
