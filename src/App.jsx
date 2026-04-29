import { useState, useEffect, createContext, useContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./index.css";

// ─── GLOBAL STATE CONTEXT ────────────────────────────────────────────────────
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ─── THEME ENGINE ─────────────────────────────────────────────────────────────
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("lang", "");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// ─── LANGUAGE GATEWAY ─────────────────────────────────────────────────────────
const LangLabel = {
  en: { primary: "ENGLISH", secondary: "Intelligence Feed", code: "EN" },
  bn: { primary: "বাংলা", secondary: "তথ্য সংবাদ", code: "বাং" },
};

function LanguageGateway({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="gateway-overlay">
      <div className="gateway-card">
        {/* Logo */}
        <div style={{ marginBottom: "2.5rem" }}>
          <a className="vd-logo" style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.4rem" }}>
            Vanguard <span>Daily</span>
          </a>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: 0,
          }}>
            INTELLIGENCE PORTAL — SELECT LANGUAGE
          </p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", gap: "1px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
          {["en", "bn"].map((lang) => (
            <button
              key={lang}
              className="gateway-option"
              style={{ border: "none", background: hovered === lang ? "var(--bg-card-hover)" : "var(--bg-card)" }}
              onMouseEnter={() => setHovered(lang)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(lang)}
            >
              <span style={{
                fontFamily: lang === "bn" ? "'Hind Siliguri', sans-serif" : "'DM Serif Display', serif",
                fontSize: lang === "bn" ? "1.5rem" : "1.35rem",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}>
                {LangLabel[lang].primary}
              </span>
              <span style={{
                fontFamily: lang === "bn" ? "'Hind Siliguri', sans-serif" : "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: lang === "bn" ? "0" : "0.08em",
              }}>
                {LangLabel[lang].secondary}
              </span>
            </button>
          ))}
        </div>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginTop: "1.25rem",
        }}>
          SELECTION PERSISTED TO LOCAL STORAGE
        </p>
      </div>
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  // ── Theme state
  const [theme, setTheme] = useState(() => getSystemTheme());

  useEffect(() => {
    applyTheme(theme);
    // Listen for OS-level changes
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => {
      const newTheme = e.matches ? "light" : "dark";
      setTheme(newTheme);
      applyTheme(newTheme);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  // ── Language state
  const [language, setLanguage] = useState(() => localStorage.getItem("vd_lang") || null);
  const [showGateway, setShowGateway] = useState(() => !localStorage.getItem("vd_lang"));

  const handleLangSelect = (lang) => {
    localStorage.setItem("vd_lang", lang);
    setLanguage(lang);
    setShowGateway(false);
    // Update html lang attribute for font fallback
    document.documentElement.lang = lang;
  };

  const switchLanguage = (lang) => {
    localStorage.setItem("vd_lang", lang);
    setLanguage(lang);
    document.documentElement.lang = lang;
  };

  // ── Search state (lifted here so TopBar and Dashboard can share it)
  const [searchQuery, setSearchQuery] = useState("");

  // Context value
  const ctxValue = {
    theme,
    toggleTheme,
    language,
    switchLanguage,
    searchQuery,
    setSearchQuery,
  };

  return (
    <AppContext.Provider value={ctxValue}>
      <HashRouter>
        {showGateway && <LanguageGateway onSelect={handleLangSelect} />}
        {!showGateway && (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/archive" element={<Dashboard archiveMode />} />
          </Routes>
        )}
      </HashRouter>
    </AppContext.Provider>
  );
}
