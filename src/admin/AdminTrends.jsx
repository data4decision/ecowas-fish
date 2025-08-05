import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "react-select";
import fisheriesData from "../data/fisheriesData.json";
import { useTranslation } from "react-i18next";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const colors = ["#f47b20", "#0b0b5c", "#20a4f4", "#7c83fd", "#40c9a2", "#dd3c3c", "#28c76f"];

const mapAll = (list) => list.map((item) => ({ label: item, value: item }));

const allIndicators = [
  "Total fish catch (MT/year)",
  "Marine capture production (MT/year)",
  "Inland capture production (MT/year)",
  "Number of fishing trips per year",
  "Average income of fishers",
  "Value of fish trade (domestic/export)",
  "Income growth rate among fishers (%)",
  "Contribution to national GDP (%)",
  "Impact of climate variability on fish availability",
  "Frequency of extreme weather events affecting catch",
  "Sea surface temperature (marine)",
  "Number of registered fishing vessels",
  "Number of fishing cooperatives",
  "Number of fishers employed",
  "Number of fish processing units",
  "Total aquaculture production (MT/year)",
  "Area under aquaculture (hectares)",
  "Number of fish hatcheries",
  "Volume of fish exports (MT/year)",
  "Value of fish exports (USD/year)",
  "Fish consumption per capita (kg/year)",
  "Fish spoilage rate (%)",
  "Access to cold storage (%)",
  "Post-harvest loss (%)",
  "Level of enforcement of sustainable fishing policies",
  "Number of reported IUU fishing cases",
  "Use of modern fishing gear (%)",
  "Percentage of women in fisheries workforce",
  "Training programs conducted for fishers",
  "Subsidies provided to fisheries sector",
  "Fish disease outbreak cases",
  "Budget allocation to fisheries sector",
];

export default function AdminTrends({ user }) {
  const { t } = useTranslation();

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [indicator, setIndicator] = useState(allIndicators[0]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState("line");

  const chartRef = useRef(null);

  const countryOptions = [...new Set(fisheriesData.map((d) => d.Country))];
  const yearOptions = [...new Set(fisheriesData.map((d) => d.Year))].sort();
  const countrySelectOptions = mapAll(countryOptions);
  const yearSelectOptions = mapAll(yearOptions);

  useEffect(() => {
    const result = fisheriesData.filter((d) => {
      const matchCountry =
        selectedCountries.length === 0 ||
        selectedCountries.some((c) => c.value === d.Country);
      const matchYear =
        selectedYears.length === 0 ||
        selectedYears.some((y) => y.value === d.Year);
      return matchCountry && matchYear;
    });
    setFilteredData(result);
  }, [selectedCountries, selectedYears, indicator]);

  const chartLabels = [...new Set(filteredData.map((d) => d.Year))].sort((a, b) => a - b);

  const datasets = selectedCountries.map((countryObj, i) => {
    const countryData = filteredData
      .filter((d) => d.Country === countryObj.value)
      .sort((a, b) => a.Year - b.Year);

    return {
      label: countryObj.label,
      data: chartLabels.map(
        (year) => countryData.find((d) => d.Year === year)?.[indicator] ?? null
      ),
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length] + "88",
      fill: false,
      tension: 0.3,
    };
  });

  if (selectedCountries.length > 1 && chartLabels.length > 0) {
    const avgData = chartLabels.map((year) => {
      const yearData = datasets
        .map((ds) => ds.data[chartLabels.indexOf(year)])
        .filter((v) => v !== null && v !== undefined);
      return yearData.length > 0
        ? yearData.reduce((sum, val) => sum + val, 0) / yearData.length
        : null;
    });

    datasets.push({
      label: t("admin_trends.average"),
      data: avgData,
      borderColor: "#000000",
      backgroundColor: "#000000",
      borderDash: [5, 5],
      fill: false,
      tension: 0.3,
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets,
  };

  const csvData = filteredData.map((d) => ({
    Country: d.Country,
    Year: d.Year,
    [indicator]: d[indicator],
  }));

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Fisheries Trend Report: ${indicator}`, 10, 10);
    autoTable(doc, {
      head: [["Country", "Year", indicator]],
      body: csvData.map((row) => [row.Country, row.Year, row[indicator]]),
    });
    doc.save("fisheries_trend_report.pdf");
  };

  const exportPNG = () => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const link = document.createElement("a");
      link.href = chartInstance.toBase64Image();
      link.download = "fisheries_trend_chart.png";
      link.click();
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-[#0b0b5c]">{t("admin_trends.title")}</h2>
        <p className="text-sm text-gray-600 max-w-3xl">{t("admin_trends.description")}</p>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">{t("admin_trends.select_countries")}</label>
            <div className="flex flex-wrap gap-2 my-2">
              <button className="text-sm bg-[#0b0b5c] text-white px-3 py-1 rounded" onClick={() => setSelectedCountries(countrySelectOptions)}>
                {t("admin_trends.select_all")}
              </button>
              <button className="text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => setSelectedCountries([])}>
                {t("admin_trends.clear")}
              </button>
            </div>
            <Select
              options={countrySelectOptions}
              isMulti
              value={selectedCountries}
              onChange={setSelectedCountries}
              placeholder={t("admin_trends.choose_countries")}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">{t("admin_trends.select_years")}</label>
            <div className="flex flex-wrap gap-2 my-2">
              <button className="text-sm bg-[#0b0b5c] text-white px-3 py-1 rounded" onClick={() => setSelectedYears(yearSelectOptions)}>
                {t("admin_trends.select_all")}
              </button>
              <button className="text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => setSelectedYears([])}>
                {t("admin_trends.clear")}
              </button>
            </div>
            <Select
              options={yearSelectOptions}
              isMulti
              value={selectedYears}
              onChange={setSelectedYears}
              placeholder={t("admin_trends.choose_years")}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">{t("admin_trends.select_indicator")}</label>
            <Select
              options={allIndicators.map((i) => ({ label: t(i, { ns: "indicators" }), value: i }))}
              value={{ label: t(indicator, { ns: "indicators" }), value: indicator }}
              onChange={(e) => setIndicator(e.value)}
              placeholder={t("admin_trends.choose_indicator")}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className={`px-4 py-2 rounded ${chartType === "line" ? "bg-[#0b0b5c] text-white" : "bg-gray-200"}`} onClick={() => setChartType("line")}>{t("admin_trends.line_chart")}</button>
          <button className={`px-4 py-2 rounded ${chartType === "bar" ? "bg-[#0b0b5c] text-white" : "bg-gray-200"}`} onClick={() => setChartType("bar")}>{t("admin_trends.bar_chart")}</button>
        </div>

        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          {filteredData.length > 0 && selectedCountries.length > 0 ? (
            chartType === "line" ? (
              <Line data={chartData} ref={chartRef} />
            ) : (
              <Bar data={chartData} ref={chartRef} />
            )
          ) : (
            <p className="text-gray-500 italic">{t("admin_trends.no_data_message")}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button onClick={exportPDF} className="bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#1c1c85]">{t("admin_trends.export_pdf")}</button>
          <CSVLink data={csvData} filename="fisheries_trends.csv" className="bg-[#f47b20] text-white px-4 py-2 rounded hover:bg-orange-600">{t("admin_trends.export_csv")}</CSVLink>
          <button onClick={exportPNG} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">{t("admin_trends.export_png")}</button>
        </div>
      </div>
    </AdminLayout>
  );
}
