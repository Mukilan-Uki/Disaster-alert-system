import { createContext, useContext, useState, useCallback } from "react";
import en from "../i18n/en";
import si from "../i18n/si";

const translations = { en, si };
const STORAGE_KEY = "alertlanka_lang";

const LanguageContext = createContext(null);

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "en"
  );

  const setLang = useCallback((code) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code === "si" ? "si" : "en";
  }, []);

  const t = useCallback(
    (key, fallback = key) => {
      const value = getNested(translations[lang], key);
      return value ?? getNested(translations.en, key) ?? fallback;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "si" : "en");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
