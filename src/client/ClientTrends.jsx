import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import fisheriesData from '../data/fisheriesData.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ClientTrends = ({ countryCode }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('production');
  const [chartType, setChartType] = useState('line');
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    if (!countryCode) {
      console.warn("No country code provided.");
      return;
    }

    const filtered = fisheriesData.filter(
      (item) => item.country?.toLowerCase() === countryCode.toLowerCase()
    );
    console.log("Filtered Data:", filtered);
    setCountryData(filtered);
  }, [countryCode]);

  const years = [...new Set(countryData.map((item) => item.year))];
  const values = countryData.map((item) => item[selectedIndicator] ?? 0);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: `${selectedIndicator} over time`,
        data: values,
        backgroundColor: '#f47b20',
        borderColor: '#0b0b5c',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  const renderChart = () => {
    if (!countryData.length) {
      return <p className="text-red-500">No data available for selected country.</p>;
    }

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return (
          <Pie
            data={{
              labels: years,
              datasets: [
                {
                  label: selectedIndicator,
                  data: values,
                  backgroundColor: ['#f47b20', '#0b0b5c', '#f4c542', '#4caf50', '#e91e63'],
                },
              ],
            }}
            options={chartOptions}
          />
        );
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  const indicatorKeys = Object.keys(fisheriesData[0] || {}).filter(
    (key) => key !== 'country' && key !== 'year'
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold text-[#0b0b5c] mb-4">
        KPI & Trends Chart - {countryCode ? countryCode.toUpperCase() : 'N/A'}
      </h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <select
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {indicatorKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div className="w-full h-[400px]">{renderChart()}</div>
    </div>
  );
};

export default ClientTrends;
