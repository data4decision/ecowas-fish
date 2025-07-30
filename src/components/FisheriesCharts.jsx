// File: components/FisheriesCharts.jsx

import React, { useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import fisheriesData from '../data/fisheriesData.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const INDICATORS = [
  { key: 'Total fish catch (MT/year)', label: 'Total Fish Catch' },
  { key: 'Average income of fishers', label: 'Average Income (USD)' },
  { key: 'Catch per unit effort (CPUE, kg/hour)', label: 'CPUE (kg/hr)' },
  { key: 'Post-harvest loss rate (%)', label: 'Post-Harvest Loss (%)' },
  { key: 'Number of active fishing vessels', label: 'Active Fishing Vessels' },
];

const COLORS = ['#0b0b5c', '#F47B20', '#16a34a', '#db2777', '#8b5cf6'];

const FisheriesCharts = ({ country, data }) => {
  const [selectedIndicators, setSelectedIndicators] = useState([INDICATORS[0].key]);
  const [chartType, setChartType] = useState('line');
  const chartRef = useRef();

  const filteredData = data
    .filter(item => item.Country === country)
    .sort((a, b) => a.Year - b.Year);

  const toggleIndicator = (indicator) => {
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;
    const csvHeader = ['Year', ...selectedIndicators].join(',');
    const csvRows = filteredData.map(row => [
      row.Year,
      ...selectedIndicators.map(ind => row[ind] ?? '')
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${country}_chart_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${country}_chart_export.pdf`);
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedIndicators.map((key, index) => (
            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      );
    } else if (chartType === 'pie') {
      const latestYear = Math.max(...filteredData.map(d => d.Year));
      const latestData = filteredData.find(d => d.Year === latestYear);
      const pieData = selectedIndicators.map(key => ({
        name: key,
        value: latestData?.[key] || 0,
      }));

      return (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    return (
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {selectedIndicators.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-700">Chart Comparison</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {INDICATORS.map(ind => (
              <label key={ind.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIndicators.includes(ind.key)}
                  onChange={() => toggleIndicator(ind.key)}
                />
                <span className="text-sm text-gray-700">{ind.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded-lg"
            value={chartType}
            onChange={e => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart (Latest Year)</option>
          </select>
          
        </div>
      </div>

      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
        <button
            onClick={handleDownloadCSV}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 text-sm bg-green-600 text-white ml-5 rounded hover:bg-green-700"
          >
            Export as PDF
          </button>
      </div>
    </div>
  );
};

export default FisheriesCharts;
