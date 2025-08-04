import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

export default function ClientHelp({ user }) {
  const { t, i18n } = useTranslation();

  const COUNTRY_NAMES = {
    NG: "Nigeria",
    GH: "Ghana",
    BJ: "Benin",
    TG: "Togo",
    CI: "Côte d'Ivoire",
    GM: "Gambia",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    LR: "Liberia",
    ML: "Mali",
    NE: "Niger",
    SL: "Sierra Leone",
    SN: "Senegal",
    BF: "Burkina Faso",
  };

  const countryCode = user?.country || user?.countryCode;
  const country = COUNTRY_NAMES[countryCode] || countryCode || t("help.your_country", { defaultValue: "Your Country" });

  const supportEmail = "d4d2025t@data4decision.org";
  const whatsappLink = "https://wa.me/2349040009930";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0b0b5c] mb-6">
        {t("help.intro", {
          country,
          defaultValue: `Welcome, ${country} Fisheries Team`,
        })}
      </h1>

      <Accordion type="single" collapsible className="w-full">
        {/* Dashboard Help */}
        <AccordionItem value="dashboard">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.dashboard.heading")}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>{t("help.dashboard.kpi")}</li>
              <li>{t("help.dashboard.trends")}</li>
              <li>{t("help.dashboard.filtering")}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Downloads Help */}
        <AccordionItem value="downloads">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.download.heading")}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>{t("help.download.steps")}</li>
              <li>{t("help.download.status")}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Glossary */}
        <AccordionItem value="glossary">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.glossary.heading")}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>{t("indicators.total_fish_catch_label", { defaultValue: "Total Fish Catch" })}:</strong>{" "}
              {t("indicators.total_fish_catch")}
            </p>
            <p>
              <strong>{t("indicators.average_income_label", { defaultValue: "Fisher Income" })}:</strong>{" "}
              {t("indicators.average_income")}
            </p>
            <p>
              <strong>{t("indicators.fishing_vessels_label", { defaultValue: "Vessels Registered" })}:</strong>{" "}
              {t("indicators.fishing_vessels")}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* FAQs */}
        <AccordionItem value="faqs">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.faqs.heading")}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-3">
            <div>
              <p><strong>Q:</strong> {t("help.faqs.q1")}</p>
              <p><strong>A:</strong> {t("help.faqs.a1")}</p>
            </div>
            <div>
              <p><strong>Q:</strong> {t("help.faqs.q2")}</p>
              <p><strong>A:</strong> {t("help.faqs.a2")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Support Contact */}
        <AccordionItem value="support">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.support.heading")}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${supportEmail}`} className="text-blue-600 underline">
                {supportEmail}
              </a>
            </p>
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a href={whatsappLink} className="text-green-600 underline">
                +234 904 000 9930
              </a>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
