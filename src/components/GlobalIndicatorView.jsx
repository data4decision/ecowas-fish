// import React, { useState } from "react";
// import Layout from "../components/Layout";
// import fisheriesData from "../data/fisheriesData.json";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // const indicators = [
// //   { key: "Total fish catch (MT/year)", label: "Total Fish Catch" },
// //   { key: "Average income of fishers", label: "Average Income (USD)" },
// //   { key: "Catch per unit effort (CPUE, kg/hour)", label: "CPUE (kg/hr)" },
// //   { key: "Post-harvest loss rate (%)", label: "Post-Harvest Loss (%)" },
// // ];
// const indicators = Object.keys(fisheriesData[0])
//   .filter((key) => key !== "Country" && key !== "Year")
//   .map((key) => ({ key, label: key }));


// export default function GlobalIndicatorView() {
//   const years = [...new Set(fisheriesData.map((item) => item.Year))].sort(
//     (a, b) => b - a
//   );
//   const allCountries = [...new Set(fisheriesData.map((item) => item.Country))];
//   const [selectedIndicator, setSelectedIndicator] = useState(indicators[0].key);
//   const [selectedYear, setSelectedYear] = useState(years[0]);

//   const chartData = allCountries.map((country) => {
//     const match = fisheriesData.find(
//       (d) => d.Country === country && d.Year === selectedYear
//     );
//     return {
//       country,
//       [selectedIndicator]: match ? match[selectedIndicator] : null,
//     };
//   });

//   const handleDownloadCSV = () => {
//     const header = "Country," + selectedIndicator;
//     const rows = chartData.map(
//       (row) => `${row.country},${row[selectedIndicator] ?? "N/A"}`
//     );
//     const csv = [header, ...rows].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//     saveAs(blob, `Global_${selectedIndicator}_${selectedYear}.csv`);
//   };

//   const handleExportPNG = async () => {
//     const element = document.getElementById("global-chart");
//     if (!element) return alert("Chart not found.");

//     try {
//       const canvas = await html2canvas(element, {
//         useCORS: true,
//         scale: 2,
//       });
//       canvas.toBlob((blob) => {
//         if (blob) {
//           saveAs(blob, `Global_${selectedIndicator}_${selectedYear}.png`);
//         } else {
//           console.error("Failed to convert canvas to blob.");
//         }
//       });
//     } catch (error) {
//       console.error("PNG Export Error:", error);
//     }
//   };

//   const handleExportPDF = async () => {
//     const element = document.getElementById("global-chart");
//     if (!element) return alert("Chart not found.");

//     try {
//       const canvas = await html2canvas(element, {
//         useCORS: true,
//         scale: 2,
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("l", "mm", "a4");
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = (canvas.height * pageWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 10, pageWidth, pageHeight);
//       pdf.save(`Global_${selectedIndicator}_${selectedYear}.pdf`);
//     } catch (error) {
//       console.error("PDF Export Error:", error);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 bg-white rounded-lg shadow">
//         <h1 className="text-xl font-bold mb-4 text-[#0b0b5c]">
//           Global Indicator Comparison
//         </h1>

//         {/* Controls */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="text-sm font-medium text-gray-700">Select Year</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//             >
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1">
//             <label className="text-sm font-medium text-gray-700">Select Indicator</label>
//             <select
//               className="w-full p-2 border rounded"
//               value={selectedIndicator}
//               onChange={(e) => setSelectedIndicator(e.target.value)}
//             >
//               {indicators.map((ind) => (
//                 <option key={ind.key} value={ind.key}>
//                   {ind.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Export Buttons */}
//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={handleDownloadCSV}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Download CSV
//           </button>
//           <button
//             onClick={handleExportPNG}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Export PNG
//           </button>
//           <button
//             onClick={handleExportPDF}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Export PDF
//           </button>
//         </div>

//         {/* Chart */}
//         <div id="global-chart" className="w-full h-[500px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="country" type="category" width={130} tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey={selectedIndicator}
//                 fill="#0b0b5c"
//                 name={selectedIndicator}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Table View */}
//         <div className="mt-8 overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="px-4 py-2 border">Country</th>
//                 <th className="px-4 py-2 border">{selectedIndicator}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {chartData.map((row, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">{row.country}</td>
//                   <td className="px-4 py-2 border">
//                     {row[selectedIndicator] ?? "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// }

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
  LabelList,
} from "recharts";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const indicators = Object.keys(fisheriesData[0])
  .filter((key) => key !== "Country" && key !== "Year")
  .map((key) => ({ key, label: key }));

export default function GlobalIndicatorView() {
  const years = [...new Set(fisheriesData.map((item) => item.Year))].sort((a, b) => b - a);
  const allCountries = [...new Set(fisheriesData.map((item) => item.Country))];

  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0].key);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const rawData = allCountries.map((country) => {
    const entry = fisheriesData.find((d) => d.Country === country && d.Year === selectedYear);
    const value = entry ? entry[selectedIndicator] : null;
    return {
      country,
      [selectedIndicator]: value,
      percentage: value !== null ? parseFloat(value) : null,
    };
  });

  const maxValue = Math.max(...rawData.map((d) => d[selectedIndicator] || 0));

  const chartData = rawData.map((d) => ({
    ...d,
    percentage: d[selectedIndicator] != null ? ((d[selectedIndicator] / maxValue) * 100).toFixed(1) + "%" : null,
  }));

  const handleDownloadCSV = () => {
    const header = "Country," + selectedIndicator;
    const rows = chartData.map((row) => `${row.country},${row[selectedIndicator] ?? "N/A"}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `Global_${selectedIndicator}_${selectedYear}.csv`);
  };

  const handleExportPNG = async () => {
    const element = document.getElementById("global-chart");
    if (!element) return alert("Chart not found.");

    try {
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `Global_${selectedIndicator}_${selectedYear}.png`);
      });
    } catch (error) {
      console.error("PNG Export Error:", error);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("global-chart");
    if (!element) return alert("Chart not found.");

    try {
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pageWidth, pageHeight);
      pdf.save(`Global_${selectedIndicator}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  return (
    
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-[#0b0b5c]">Global Indicator Comparison</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Select Year</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Select Indicator</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
            >
              {indicators.map((ind) => (
                <option key={ind.key} value={ind.key}>{ind.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={handleDownloadCSV} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download CSV</button>
          <button onClick={handleExportPNG} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Export PNG</button>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Export PDF</button>
        </div>

        <div id="global-chart" className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" width={130} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [value, selectedIndicator]} />
              <Legend />
              <Bar dataKey={selectedIndicator} fill="#0b0b5c" name={selectedIndicator}>
                <LabelList
                  dataKey="percentage"
                  position="right"
                  style={{ fontSize: "10px", fill: "#444" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">{selectedIndicator}</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{row.country}</td>
                  <td className="px-4 py-2 border">{row[selectedIndicator] ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   
  );
}
