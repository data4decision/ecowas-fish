import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import fisheriesData from "../data/fisheriesData.json";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import GlobalIndicatorView from "./GlobalIndicatorView";

const flagEmoji = (country) => {
  const code = country
    .toUpperCase()
    .slice(0, 2)
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
  return code;
};

const CompareViews = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return <div>{t("loading", "Loading...")}</div>;

  const years = [...new Set(fisheriesData.map((item) => item.Year))].sort((a, b) => b - a);
  const countries = [...new Set(fisheriesData.map((item) => item.Country))];

  const indicators = Object.keys(fisheriesData[0])
    .filter((key) => key !== "Country" && key !== "Year")
    .map((key) => ({ key, label: t(`indicators.${key}`, key) }));

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedIndicators, setSelectedIndicators] = useState([indicators[0].key]);
  const [selectedCountries, setSelectedCountries] = useState(["Benin", "Ghana"]);

  const handleCountryChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setSelectedCountries(selected);
  };

  const handleIndicatorChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setSelectedIndicators(selected);
  };

  const filteredData = selectedCountries
    .map((country) => {
      const item = fisheriesData.find(
        (d) => d.Country === country && d.Year === selectedYear
      );
      if (!item) return null;

      const obj = { country: `${flagEmoji(country)} ${country}` };
      selectedIndicators.forEach((key) => {
        obj[key] = item[key];
      });
      return obj;
    })
    .filter(Boolean);

  const regionalAverage = () => {
    const region = { country: "🌍 " + t("compare_view.regional_average", "Regional Avg") };
    selectedIndicators.forEach((key) => {
      const sum = filteredData.reduce((acc, cur) => acc + (cur[key] || 0), 0);
      const avg = sum / filteredData.length;
      region[key] = +avg.toFixed(2);
    });
    return region;
  };

  const combinedData = [...filteredData, regionalAverage()];

  const handleDownloadCSV = () => {
    const header = ["Country", ...selectedIndicators.map((k) => k.replace(/,/g, ""))].join(",");
    const rows = combinedData.map((row) =>
      [row.country, ...selectedIndicators.map((k) => row[k])].join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, `Compare_${selectedYear}.csv`);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("chart-container");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Compare_${selectedYear}.pdf`);
  };

  const handleExportPNG = async () => {
    const element = document.getElementById("chart-container");
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => {
      saveAs(blob, `Compare_${selectedYear}.png`);
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <GlobalIndicatorView/>
      <h1 className="text-xl font-bold mb-4 text-[#0b0b5c]">
        {t("compare_view.title", "Comparative Analytics View")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold">
            {t("compare_view.select_indicator", "Select Indicator(s)")}
          </label>
          <select
            className="w-full p-2 border rounded h-32"
            multiple
            value={selectedIndicators}
            onChange={handleIndicatorChange}
          >
            {indicators.map((ind) => (
              <option key={ind.key} value={ind.key}>
                {ind.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            {t("compare_view.multi_select_hint", "Hold Ctrl/Cmd to select multiple")}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold">
            {t("compare_view.select_year", "Select Year")}
          </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">
            {t("compare_view.select_countries", "Select Countries")}
          </label>
          <select
            multiple
            className="w-full p-2 border rounded h-32"
            value={selectedCountries}
            onChange={handleCountryChange}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            {t("compare_view.multi_select_hint", "Hold Ctrl/Cmd to select multiple")}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("compare_view.download_csv", "Download CSV")}
        </button>
        <button
          onClick={handleExportPNG}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {t("compare_view.export_png", "Export PNG")}
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t("compare_view.export_pdf", "Export PDF")}
        </button>
      </div>

      <div id="chart-container" className="bg-gray-50 p-4 rounded mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedIndicators.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={t(`indicators.${key}`, key)}
                fill={index % 2 === 0 ? "#0b0b5c" : "#10b981"}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">
                {t("compare_view.country", "Country")}
              </th>
              {selectedIndicators.map((key) => (
                <th key={key} className="border px-3 py-2 text-left">
                  {t(`indicators.${key}`, key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {combinedData.map((row) => (
              <tr key={row.country}>
                <td className="border px-3 py-1">{row.country}</td>
                {selectedIndicators.map((key) => (
                  <td key={key} className="border px-3 py-1">
                    {row[key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareViews;
