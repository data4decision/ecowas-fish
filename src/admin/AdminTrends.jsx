import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import Select from "react-select";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from "chart.js";
import fisheriesData from "../data/fisheriesData.json";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function AdminTrends({ user }) {
  const { t } = useTranslation();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [years, setYears] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("line");

  const allCountries = [...new Set(fisheriesData.map(d => d.Country))];
  const allIndicators = Object.keys(fisheriesData[0]).filter(
    key => !["Country", "Year"].includes(key)
  );

  useEffect(() => {
    const yearSet = new Set(fisheriesData.map(d => d.Year));
    setYears([...yearSet].sort());
  }, []);

  const chartColors = ["#0b0b5c", "#f47b20", "#2a9d8f", "#e76f51", "#264653"];

  const handleGenerateChart = () => {
    if (!selectedCountries.length || !selectedIndicators.length) return;

    const datasets = selectedIndicators.map((indicator, idx) => {
      return {
        label: t(`indicators.${indicator}`) || indicator,
        data: years.map(year => {
          const values = fisheriesData.filter(
            d => selectedCountries.includes(d.Country) && d.Year === year
          ).map(d => d[indicator]);
          return values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : null;
        }),
        borderColor: chartColors[idx % chartColors.length],
        backgroundColor: chartColors[idx % chartColors.length],
        borderWidth: 2,
        fill: false
      };
    });

    setChartData({
      labels: years,
      datasets
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(t("admin_trends.title"), 20, 10);
    doc.autoTable({
      head: [["Country", "Year", ...selectedIndicators]],
      body: fisheriesData
        .filter(d => selectedCountries.includes(d.Country))
        .map(d => [d.Country, d.Year, ...selectedIndicators.map(ind => d[ind])]),
    });
    doc.save("yearly_trends.pdf");
  };

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{t("admin_trends.title")}</h2>
        <p className="mb-4 text-sm text-gray-600">{t("admin_trends.description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin_trends.select_countries")}</label>
            <Select
              isMulti
              options={allCountries.map(c => ({ value: c, label: c }))}
              onChange={opts => setSelectedCountries(opts.map(o => o.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin_trends.select_indicators")}</label>
            <Select
              isMulti
              options={allIndicators.map(i => ({ value: i, label: t(`indicators.${i}`) }))}
              onChange={opts => setSelectedIndicators(opts.map(o => o.value))}
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin_trends.chart_type")}</label>
            <Select
              options={[
                { value: "line", label: t("admin_trends.line_chart") },
                { value: "bar", label: t("admin_trends.bar_chart") }
              ]}
              defaultValue={{ value: "line", label: t("admin_trends.line_chart") }}
              onChange={opt => setChartType(opt.value)}
            />
          </div>

          <button
            onClick={handleGenerateChart}
            className="bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#25258c] self-end"
          >
            {t("admin_trends.generate")}
          </button>

          {chartData && (
            <>
              <CSVLink
                data={fisheriesData.filter(d => selectedCountries.includes(d.Country))}
                filename="trends_export.csv"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-end"
              >
                {t("admin_trends.export_csv")}
              </CSVLink>
              <button
                onClick={handleExportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 self-end"
              >
                {t("admin_trends.export_pdf")}
              </button>
            </>
          )}
        </div>

        {chartData && (
          <div className="bg-white shadow rounded p-4">
            {chartType === "line" ? (
              <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            ) : (
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
