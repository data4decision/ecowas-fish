import React, { useEffect, useState } from "react";
import { loadCountryData } from "../utils/loadCountryData";
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
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const KPI_FIELDS = [
  { key: "Total fish catch (MT/year)", category: "Catch" },
  { key: "% contribution of fisheries to food security", category: "Social" },
  { key: "Number of active fishing vessels", category: "Catch" },
  { key: "Number of active fisher cooperatives", category: "Economic" },
  { key: "% of fishers trained on sustainable practices", category: "Environmental" },
];

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

export default function ClientKPI({ user }) {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [compareAvg, setCompareAvg] = useState(false);
  const [category, setCategory] = useState("All");
  const { t } = useTranslation();

  const rawCode = user?.countryCode?.toLowerCase() || "ng";
  const mappedCode = countryMap[rawCode] || rawCode;

  useEffect(() => {
    async function fetchData() {
      const json = await loadCountryData(mappedCode);
      setData(json);

      const sorted = [...new Set(json.map(d => d.Year))].sort((a, b) => b - a);
      setSelectedYear(sorted[0]);
    }
    if (user?.countryCode) fetchData();
  }, [user?.countryCode]);

  const selectedData = data.find(d => d.Year === selectedYear) || {};
  const previousData = data.find(d => d.Year === selectedYear - 1) || {};
  const years = [...new Set(data.map(d => d.Year))].sort();

  const averages = KPI_FIELDS.reduce((acc, { key }) => {
    const values = data.map(d => d[key]).filter(Number);
    acc[key] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return acc;
  }, {});

  const getChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const diff = current - previous;
    return ((diff / previous) * 100).toFixed(1);
  };

  const renderSparkline = (key, color) => {
    const labels = data.map(d => d.Year);
    const values = data.map(d => d[key] ?? 0);
    const chartData = {
      labels,
      datasets: [{
        data: values,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
      }],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { display: false }, y: { display: false } },
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
    };
    return <div className="h-16 mt-1"><Line data={chartData} options={options} /></div>;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(t("client_kpi.title"), 14, 12);
    doc.text(`${t("client_kpi.category")}: ${mappedCode.toUpperCase()} | ${t("client_kpi.select_year")}: ${selectedYear}`, 14, 20);
    const tableData = KPI_FIELDS.map(({ key }) => [t(`client_kpi.indicators.${key}`), selectedData[key] ?? 0]);
    autoTable(doc, { head: [[t("client_kpi.indicators.Indicator"), t("client_kpi.indicators.Value")]], body: tableData, startY: 30 });
    doc.save("kpi-report.pdf");
  };

  const filteredFields = category === "All" ? KPI_FIELDS : KPI_FIELDS.filter(f => f.category === category);

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label>{t("client_kpi.select_year")}:
          <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)} className="ml-1 border rounded p-1">
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>{t("client_kpi.category")}:
  <select value={category} onChange={e => setCategory(e.target.value)} className="ml-1 border rounded p-1">
    <option value="All">{t("client_kpi.categories.All")}</option>
    <option value="Catch">{t("client_kpi.categories.Catch")}</option>
    <option value="Social">{t("client_kpi.categories.Social")}</option>
    <option value="Economic">{t("client_kpi.categories.Economic")}</option>
    <option value="Environmental">{t("client_kpi.categories.Environmental")}</option>
  </select>
</label>

        <label className="flex items-center gap-1">
          <input type="checkbox" checked={compareAvg} onChange={() => setCompareAvg(!compareAvg)} /> {t("client_kpi.compare_avg")}:
        </label>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleExportPDF}>{t("client_kpi.export_pdf")}</button>
        <CSVLink
          data={filteredFields.map(({ key }) => ({ Indicator: t(`client_kpi.indicators.${key}`), Value: selectedData[key] ?? 0 }))}
          filename={`kpi-report-${mappedCode}-${selectedYear}.csv`}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >{t("client_kpi.export_csv")}</CSVLink>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filteredFields.map(({ key, category }, idx) => {
          const current = selectedData[key] ?? 0;
          const previous = previousData[key] ?? 0;
          const change = getChange(current, previous);
          const avg = averages[key] ?? 0;
          const color = ["red", "goldenrod", "limegreen", "seagreen", "dodgerblue"][idx % 5];

          return (
            <div key={key} className="bg-white rounded-xl shadow p-4 h-full">
              <h4 className="text-sm font-medium text-gray-500">{t(`client_kpi.indicators.${key}`)}</h4>
              <p className="text-2xl font-bold text-[#0b0b5c]">{current.toLocaleString()}</p>
              {change !== null && <p className={`text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>{change >= 0 ? <ArrowUpRight className="inline w-4 h-4" /> : <ArrowDownRight className="inline w-4 h-4" />} {Math.abs(change)}% {t("client_kpi.change_from", { change: Math.abs(change), year: selectedYear - 1 })}</p>}
              {compareAvg && <p className="text-xs text-gray-500">{t("client_kpi.avg_comparison", { diff: (current - avg).toFixed(1), avg: avg.toFixed(1) })}</p>}
              {renderSparkline(key, color)}
              <p className="text-xs text-gray-400 mt-1">{t("client_kpi.kpi_description", { category })}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
