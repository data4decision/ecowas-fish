import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Dialog } from "@headlessui/react";
import { saveAs } from "file-saver";
import fisheriesData from "../data/fisheriesData.json";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CountryComparisonChart() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [indicator, setIndicator] = useState("Total fish catch (MT/year)");
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const allCountries = [
    "Benin", "Burkina Faso", "Cape Verde", "C\u00f4te d'Ivoire", "Gambia",
    "Ghana", "Guinea", "Guinea-Bissau", "Liberia", "Mali",
    "Niger", "Nigeria", "Senegal", "Sierra Leone", "Togo"
  ];

  useEffect(() => {
    const years = [...new Set(fisheriesData.map(d => d.Year))].sort((a, b) => b - a);
    setYearOptions(years);
    setSelectedYear(years[0]);
  }, []);

  useEffect(() => {
    if (!selectedYear || !indicator) return;

    const filtered = fisheriesData.filter(d => d.Year === selectedYear);

    const values = allCountries.map(country => {
      const entry = filtered.find(d => d.Country === country);
      const value = entry?.[indicator];
      return typeof value === "number" ? value : null;
    });

    const backgroundColors = values.map(value => {
      if (value == null) return "#ccc"; // grey for no data
      if (value > 70) return "#0b9c4f"; // green
      if (value > 40) return "#f47b20"; // orange
      return "#e63946"; // red
    });

    setChartData({
      labels: allCountries,
      datasets: [
        {
          label: indicator,
          data: values,
          backgroundColor: backgroundColors
        }
      ]
    });
  }, [selectedYear, indicator]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return value == null ? "No data" : `${indicator}: ${value.toLocaleString()}`;
          }
        }
      },
      title: {
        display: true,
        text: `${indicator} in ${selectedYear}`,
        color: "#0b0b5c"
      }
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        const country = allCountries[idx];
        handleBarClick(country);
      }
    },
    scales: {
      x: { ticks: { color: "#0b0b5c" } },
      y: { ticks: { color: "#0b0b5c" } }
    }
  };

  const handleBarClick = (country) => {
    const dataForCountry = fisheriesData.find(
      (d) => d.Country === country && d.Year === selectedYear
    );
    if (dataForCountry) {
      setSelectedCountry(dataForCountry);
      setShowModal(true);
    }
  };

  const handleDownload = (format = "png") => {
    const chart = chartRef.current;
    if (!chart) return;

    const fileName = `ECOWAS_${indicator.replace(/[^a-zA-Z0-9]/g, "_")}_${selectedYear}`;

    if (format === "png") {
      const link = document.createElement("a");
      link.href = chart.toBase64Image();
      link.download = `${fileName}.png`;
      link.click();
    } else if (format === "pdf") {
      import("jspdf").then(jsPDF => {
        const pdf = new jsPDF.jsPDF("landscape");
        const imageData = chart.toBase64Image();

        pdf.setFontSize(16);
        pdf.setTextColor("#0b0b5c");
        pdf.text(`Country Comparison - ${indicator}`, 10, 15);
        pdf.text(`Year: ${selectedYear}`, 10, 25);

        const logo = new Image();
        logo.src = "/logo.png";
        logo.onload = () => {
          pdf.addImage(logo, "PNG", 240, 5, 40, 15);
          pdf.addImage(imageData, "PNG", 10, 30, 270, 140);
          pdf.save(`${fileName}.pdf`);
        };
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 my-10">
      <div className="flex justify-between flex-wrap mb-4 gap-4">
        <h3 className="text-xl font-semibold text-[#0b0b5c]">Country Comparison</h3>

        <div className="flex gap-4 flex-wrap">
          <select
            className="border rounded-lg px-3 py-2 text-sm text-[#0b0b5c]"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>Year: {year}</option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm text-[#0b0b5c]"
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
          >
            <option value="Total fish catch (MT/year)">Total Fish Catch (MT)</option>
            <option value="Post-harvest loss rate (%)">Post-Harvest Loss (%)</option>
            <option value="Average income of fishers">Average Income</option>
            <option value="Cold chain access (%)">Cold Chain Access</option>
            <option value="Fishers' dependency on fisheries (%)">Fishers' Dependency</option>
            <option value="Resilience index to climate shocks">Resilience Index</option>
            <option value="Fisheries budget execution rate (%)">Budget Execution Rate</option>
          </select>

          <button
            onClick={() => handleDownload("png")}
            className="bg-[#0b0b5c] text-white text-sm px-4 py-2 rounded hover:bg-[#08084a]"
          >
            Download PNG
          </button>

          <button
            onClick={() => handleDownload("pdf")}
            className="bg-[#f47b20] text-white text-sm px-4 py-2 rounded hover:bg-[#d2641b]"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        {chartData ? (
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-500">Loading chart...</p>
        )}
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-[#0b0b5c] mb-4">
              {selectedCountry?.Country} - {selectedYear}
            </Dialog.Title>

            {selectedCountry ? (
              <div className="text-sm text-gray-700 space-y-2">
                {Object.entries(selectedCountry).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {typeof value === "number" ? value.toLocaleString() : value || "N/A"}
                  </p>
                ))}
              </div>
            ) : (
              <p>Loading...</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                className="text-sm px-4 py-2 bg-[#f47b20] text-white rounded hover:bg-[#d2641b]"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
