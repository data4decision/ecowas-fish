import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import fisheriesData from "../data/fisheriesData.json";

export default function AdminKpiCards() {
  const { t, i18n } = useTranslation(); 
  const [kpis, setKpis] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [indicator, setIndicator] = useState(null);
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const years = [...new Set(fisheriesData.map(d => d.Year))].sort((a, b) => b - a);
    setYearOptions(years);
    setSelectedYear(years[0]);

    const sample = fisheriesData[0];
    const keysToExclude = ["Year", "Country"];
    const extractedIndicators = Object.keys(sample).filter(k => !keysToExclude.includes(k));
    setIndicators(extractedIndicators);
    setIndicator(extractedIndicators[0]);
  }, []);

  useEffect(() => {
    if (!selectedYear || !indicator) return;

    const data = fisheriesData.filter(d => d.Year === selectedYear);
    const countries = [...new Set(fisheriesData.map(d => d.Country))];
    const totalCountries = countries.length;
    const yearsCovered = [...new Set(fisheriesData.map(d => d.Year))].length;

    const totalFishCatch = avg(data.map(d => d["Total fish catch (MT/year)"]));
    const postHarvestLoss = avg(data.map(d => d["Post-harvest loss rate (%)"]));
    const totalRegisteredFishers = sum(data.map(d => d["Number of registered fishers"]));
    const digitalReporting = (
      data.filter(d => String(d["Digital data collection systems in place"]).toLowerCase() === "yes").length /
      totalCountries
    ) * 100;
    const enforcementScore = avg(data.map(d => d["Enforcement capacity score"]));
    const budgetExecRate = avg(data.map(d => d["Fisheries budget execution rate (%)"]));
    const indicatorAvg = avg(data.map(d => d[indicator]));

    setKpis([
      { title: t('admin_kpi_card.total_ecowas_countries'), value: totalCountries },
      { title: t('admin_kpi_card.years_covered'), value: yearsCovered },
      { title: t('admin_kpi_card.selected_year'), value: selectedYear },
      { title: t('admin_kpi_card.avg_total_fish_catch'), value: formatNumber(totalFishCatch) },
      { title: t('admin_kpi_card.avg_post_harvest_loss'), value: `${postHarvestLoss.toFixed(2)}%` },
      { title: t('admin_kpi_card.total_registered_fishers'), value: formatNumber(totalRegisteredFishers) },
      { title: t('admin_kpi_card.digital_reporting'), value: `${digitalReporting.toFixed(2)}%` },
      { title: t('admin_kpi_card.avg_enforcement_capacity'), value: enforcementScore.toFixed(2) },
      { title: t('admin_kpi_card.avg_budget_execution'), value: `${budgetExecRate.toFixed(2)}%` },
      { title: t('admin_kpi_card.avg_indicator', { indicator: t(indicator, { ns: 'indicator' }) }), value: formatNumber(indicatorAvg) }
    ]);
  }, [selectedYear, indicator, i18n.language]);

  function avg(arr) {
    const nums = arr.filter(n => typeof n === "number" && !isNaN(n));
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  }

  function sum(arr) {
    return arr.filter(n => typeof n === "number").reduce((a, b) => a + b, 0);
  }

  function formatNumber(n) {
    return n?.toLocaleString(i18n.language === "fr" ? "fr-FR" : i18n.language === "pt" ? "pt-PT" : "en-US", { maximumFractionDigits: 2 }) || "N/A";
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#0b0b5c]">{t('admin_kpi_card.dashboard_overview')}</h2>

        <div className="flex gap-4 flex-wrap">
          <select
            className="border rounded-lg px-3 py-2 text-sm text-[#0b0b5c]"
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {t('admin_kpi_card.year')}: {year}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm text-[#0b0b5c]"
            value={indicator || ""}
            onChange={(e) => setIndicator(e.target.value)}
          >
            {indicators.map((ind, i) => (
              <option key={i} value={ind}>
                {t(ind, { ns: 'indicator' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-[#f47b20] hover:scale-105 transition-transform duration-200"
          >
            <p className="text-sm text-gray-500">{kpi.title}</p>
            <p className="text-xl font-bold text-[#0b0b5c] mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
