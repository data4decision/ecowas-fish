import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";


export default function ClientHelp({ user }) {
  const { t } = useTranslation();
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
const country = COUNTRY_NAMES[countryCode] || countryCode || "Your Country";


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
            {t("help.dashboard.heading", {
              defaultValue: "Understanding the Dashboard",
            })}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {t("help.dashboard.kpi", {
                  defaultValue:
                    "Learn how to read KPI cards and what each metric means.",
                })}
              </li>
              <li>
                {t("help.dashboard.trends", {
                  defaultValue:
                    "Explore how to interact with the yearly trends chart.",
                })}
              </li>
              <li>
                {t("help.dashboard.filtering", {
                  defaultValue:
                    "Understand how the dashboard displays only data related to your country.",
                })}
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Downloads Help */}
        <AccordionItem value="downloads">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.download.heading", {
              defaultValue: "How to Download Reports",
            })}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {t("help.download.steps", {
                  defaultValue:
                    "Navigate to the Downloads section and click the download icon beside each report.",
                })}
              </li>
              <li>
                {t("help.download.status", {
                  defaultValue:
                    "Approved reports are available to download; pending ones are under review.",
                })}
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Glossary */}
        <AccordionItem value="glossary">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.glossary.heading", {
              defaultValue: "Glossary of Key Indicators",
            })}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Total Fish Catch:</strong>{" "}
              {t("indicators.total_fish_catch", {
                defaultValue: "Total weight of fish caught annually.",
              })}
            </p>
            <p>
              <strong>Fisher Income:</strong>{" "}
              {t("indicators.average_income", {
                defaultValue: "Average annual income of fishers.",
              })}
            </p>
            <p>
              <strong>Vessels Registered:</strong>{" "}
              {t("indicators.fishing_vessels", {
                defaultValue:
                  "Number of officially registered fishing vessels.",
              })}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* FAQs */}
        <AccordionItem value="faqs">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.faqs.heading", {
              defaultValue: "Frequently Asked Questions",
            })}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-3">
            <div>
              <p>
                <strong>Q:</strong>{" "}
                {t("help.faqs.q1", {
                  defaultValue: "Why can’t I see other countries’ data?",
                })}
              </p>
              <p>
                <strong>A:</strong>{" "}
                {t("help.faqs.a1", {
                  defaultValue:
                    "For data privacy and relevance, users only see data related to their own country.",
                })}
              </p>
            </div>

            <div>
              <p>
                <strong>Q:</strong>{" "}
                {t("help.faqs.q2", {
                  defaultValue: "How do I get the latest reports?",
                })}
              </p>
              <p>
                <strong>A:</strong>{" "}
                {t("help.faqs.a2", {
                  defaultValue:
                    "Approved reports are automatically listed in your downloads section. Check regularly for updates.",
                })}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Support Contact */}
        <AccordionItem value="support">
          <AccordionTrigger className="font-semibold text-left text-[#0b0b5c]">
            {t("help.support.heading", {
              defaultValue: "Contact Support",
            })}
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-blue-600 underline"
              >
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
