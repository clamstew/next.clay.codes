import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// import { getInitialNamespaces } from "remix-i18next/client";

export default function getI18nInstance(locale: string) {
  const i18n = createInstance();

  i18n
    .use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .init({
      supportedLngs: ["en"], // add your languages: "es", "fr", etc.
      fallbackLng: "en",
      defaultNS: "common",
      // was getInitialNamespaces() for client, but threw errors and it can be simple for now
      ns: typeof window === "undefined" ? ["common"] : [],
      lng: locale,
      detection: {
        order: ["htmlTag"],
      },
    });

  return i18n;
}
