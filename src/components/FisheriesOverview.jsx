import React, { useState, useEffect, useRef } from 'react';
import fisheriesData from '../data/fisheriesData.json';
import FisheriesCharts from '../components/FisheriesCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FisheriesOverview = ({ data }) => {
  const localCountries = [...new Set(fisheriesData.map(item => item.Country))];
  const localYears = [...new Set(fisheriesData.map(item => item.Year))].sort((a, b) => b - a);

  const [selectedCountry, setSelectedCountry] = useState('Benin');
  const [selectedYear, setSelectedYear] = useState(localYears[0]);

  const printRef = useRef();

  useEffect(() => {
    const savedYear = localStorage.getItem('selectedYear');
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedYear) setSelectedYear(Number(savedYear));
    if (savedCountry) setSelectedCountry(savedCountry);
  }, []);

  const isFiltered = Array.isArray(data) && data.length > 0;

  const filtered = isFiltered
    ? null
    : fisheriesData.find(item => item.Country === selectedCountry && item.Year === selectedYear);

  const prevYearData = !isFiltered
    ? fisheriesData.find(item => item.Country === selectedCountry && item.Year === selectedYear - 1)
    : null;

  const handleExportPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${selectedCountry}_${selectedYear}_summary.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTrendArrow = (curr, prev) => {
    if (curr > prev) return '🔼';
    if (curr < prev) return '🔽';
    return '⏺';
  };

  const statBox = (title, value, prevValue = null, color = 'text-blue-600') => (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>
        {value ?? 'N/A'}{" "}
        {prevValue !== null && (
          <span className="text-sm">{getTrendArrow(value, prevValue)}</span>
        )}
      </p>
    </div>
  );

  const alertCards = [];
  const target = isFiltered ? null : filtered;

  if (target?.['Post-harvest loss rate (%)'] > 70) {
    alertCards.push({ label: '⚠️ High Post-Harvest Loss', color: 'bg-red-100 text-red-700' });
  }

  if (target?.['% of informal/unregistered fishers'] > 50) {
    alertCards.push({ label: '🔒 High Informal Sector Rate', color: 'bg-yellow-100 text-yellow-800' });
  }

  return (
    <div className="p-4">
      {/* Manual Select */}
      {!isFiltered && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Select Country</label>
            <select
              className="w-full p-2 mt-1 border rounded-lg"
              value={selectedCountry}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCountry(val);
                localStorage.setItem('selectedCountry', val);
              }}
            >
              {localCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Select Year</label>
            <select
              className="w-full p-2 mt-1 border rounded-lg"
              value={selectedYear}
              onChange={(e) => {
                const year = Number(e.target.value);
                setSelectedYear(year);
                localStorage.setItem('selectedYear', year);
              }}
            >
              {localYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex justify-end mb-4 mr-3 gap-4">
        <button onClick={handleExportPDF} className="px-4 py-2 bg-[#0b0b5c] text-white rounded-lg hover:bg-[#0b2b5c]">
          Export to PDF
        </button>
        <button onClick={handlePrint} className="px-2 py-2 bg-[#F47B20] text-white rounded-lg hover:bg-[#F45B20]">
          Print Summary
        </button>
      </div>

      {/* Printable Section */}
      <div ref={printRef}>
        {/* Alerts */}
        {alertCards.length > 0 && (
          <div className="grid gap-4 mb-6">
            {alertCards.map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg font-medium shadow ${alert.color}`}>
                {alert.label}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 text-[#0b0b5c]">
          {isFiltered
            ? data.map((entry, i) =>
                Object.entries(entry).map(([key, value]) =>
                  key !== 'country' && key !== 'year'
                    ? statBox(`${key} (${entry.country}, ${entry.year})`, value)
                    : null
                )
              )
            : (
              <>
                {statBox('Total Fish Catch (MT/year)', filtered?.['Total fish catch (MT/year)'], prevYearData?.['Total fish catch (MT/year)'])}
                {statBox('Inland Capture (MT/year)', filtered?.['Inland capture production (MT/year)'], prevYearData?.['Inland capture production (MT/year)'])}
                {statBox('Marine Capture (MT/year)', filtered?.['Marine capture production (MT/year)'], prevYearData?.['Marine capture production (MT/year)'])}
                {statBox('Fishing Trips per Year', filtered?.['Number of fishing trips per year'], prevYearData?.['Number of fishing trips per year'])}
                {statBox('Active Fishing Vessels', filtered?.['Number of active fishing vessels'], prevYearData?.['Number of active fishing vessels'])}
                {statBox('Catch per Unit Effort (kg/hr)', filtered?.['Catch per unit effort (CPUE, kg/hour)'], prevYearData?.['Catch per unit effort (CPUE, kg/hour)'], 'text-green-600')}
                {statBox('Average Income (USD)', filtered?.['Average income of fishers'], prevYearData?.['Average income of fishers'], 'text-purple-600')}
                {statBox('Post-harvest Loss Rate (%)', filtered?.['Post-harvest loss rate (%)'], prevYearData?.['Post-harvest loss rate (%)'], 'text-red-600')}
              </>
            )}
        </div>
      </div>

      {/* Charts (Always Rendered Now) */}
      <FisheriesCharts
  data={fisheriesData
    .filter(item => item.Country === selectedCountry)
    .sort((a, b) => a.Year - b.Year)}
  country={selectedCountry}
/>

    </div>
  );
};

export default FisheriesOverview;
