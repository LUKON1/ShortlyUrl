import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru_lang from "./languages/ru_lang.json";
import en_lang from "./languages/en_lang.json";

const resources = {
  ru: {
    translation: ru_lang,
  },
  en: {
    translation: en_lang,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "ru",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;
