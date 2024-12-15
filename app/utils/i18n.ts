import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export default async function getI18nInstance(locale: string) {
  const i18n = createInstance();

  await i18n
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .init({
      supportedLngs: ["de", "en", "es", "fr", "it", "nl", "pt", "zh"],
      fallbackLng: "en",
      defaultNS: "common",
      // was getInitialNamespaces() for client, but threw errors and it can be simple for now
      ns: typeof window === "undefined" ? ["common"] : [],
      lng: locale,
      // debug: process.env.NODE_ENV === "development",
      detection: {
        order: ["navigator"],
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
}
