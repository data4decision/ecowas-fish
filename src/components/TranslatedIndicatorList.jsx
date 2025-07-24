import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const TranslatedIndicatorList = ({ indicators }) => {
  const { t } = useTranslation("indicators");

  return (
    <ul className="list-disc pl-6 text-sm">
      {indicators.map((indicator, idx) => (
        <li key={idx} className="mb-1">
          {t(indicator)}
        </li>
      ))}
    </ul>
  );
};

export const TranslatedSelectOptions = ({ indicators, selected, onChange }) => {
  const { t } = useTranslation("indicators");

  return (
    <select
      multiple
      value={selected}
      onChange={(e) =>
        onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))
      }
      className="w-full border p-2 rounded h-32"
    >
      {indicators.map((indicator, idx) => (
        <option key={idx} value={indicator}>
          {t(indicator)}
        </option>
      ))}
    </select>
  );
};

export default TranslatedIndicatorList;
