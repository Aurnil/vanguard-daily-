import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "./App";

// ─── ICONS ─────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconArchive = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Monochrome social icons
const IconX = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGitHub = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

// ─── UTILITY ───────────────────────────────────────────────────────────────────
function formatTimestamp(iso, lang) {
  const date = new Date(iso);
  if (lang === "bn") {
    return new Intl.DateTimeFormat("bn-BD", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
}

const UI = {
  en: {
    breaking:    "BREAKING",
    global:      "GLOBAL",
    national:    "NATIONAL",
    archiveBtn:  "CONSULT SYSTEM ARCHIVE",
    breakingFeed:"BREAKING INTELLIGENCE",
    searchPH:    "search headlines...",
    readMore:    "READ DISPATCH",
    close:       "CLOSE",
    noResults:   "NO DISPATCHES MATCH QUERY",
    noResultsSub:"Adjust search parameters",
    statusLine:  "LIVE FEED",
  },
  bn: {
    breaking:    "ব্রেকিং",
    global:      "বৈশ্বিক",
    national:    "জাতীয়",
    archiveBtn:  "সিস্টেম আর্কাইভ দেখুন",
    breakingFeed:"জরুরি তথ্য",
    searchPH:    "শিরোনাম খুঁজুন...",
    readMore:    "বিস্তারিত পড়ুন",
    close:       "বন্ধ",
    noResults:   "কোনো সংবাদ পাওয়া যায়নি",
    noResultsSub:"অনুসন্ধান পরিবর্তন করুন",
    statusLine:  "সরাসরি ফিড",
  },
};

// ─── CATEGORY BADGE ────────────────────────────────────────────────────────────
function CategoryBadge({ category, isBreaking, lang }) {
  const t = UI[lang] || UI.en;
  return (
    <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}>
      {isBreaking && (
        <span className="category-badge badge-breaking">{t.breaking}</span>
      )}
      <span className={`category-badge ${category === "Global" ? "badge-global" : "badge-national"}`}>
        {category === "Global" ? t.global : t.national}
      </span>
    </div>
  );
}

// ─── ARTICLE MODAL ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose, lang }) {
  const t = UI[lang] || UI.en;
  const isBn = lang === "bn";

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : undefined }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <CategoryBadge category={article.category} isBreaking={article.isBreaking} lang={lang} />
          <button
            onClick={onClose}
            style={{
              background: "none", border: "1px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer",
              borderRadius: "2px", padding: "0.3rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <IconClose />
          </button>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Serif Display', serif",
          fontSize: isBn ? "1.35rem" : "1.5rem",
          fontWeight: isBn ? 600 : 400,
          lineHeight: 1.25,
          color: "var(--text-primary)",
          margin: "0 0 0.75rem 0",
        }}>
          {article.headline}
        </h2>

        {/* Timestamp */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}>
          {formatTimestamp(article.timestamp, lang)}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />

        {/* Content */}
        <p style={{
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          fontSize: isBn ? "1rem" : "0.9rem",
          margin: 0,
        }}>
          {article.content}
        </p>
      </div>
    </div>
  );
}

// ─── NEWS CARD ─────────────────────────────────────────────────────────────────
function NewsCard({ article, onClick, lang, isFeatured }) {
  const isBn = lang === "bn";

  return (
    <div
      className={`news-card ${article.isBreaking ? "breaking" : ""}`}
      onClick={() => onClick(article)}
      style={{ transition: "background 150ms ease-in-out, border-color 150ms ease-in-out" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", height: "100%" }}>
        <CategoryBadge category={article.category} isBreaking={article.isBreaking} lang={lang} />

        <h3
          className="card-headline"
          style={{
            fontFamily: isFeatured
              ? (isBn ? "'Hind Siliguri', sans-serif" : "'DM Serif Display', serif")
              : (isBn ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif"),
            fontSize: isFeatured ? (isBn ? "1.2rem" : "1.45rem") : (isBn ? "0.9rem" : "0.88rem"),
            fontWeight: isFeatured ? (isBn ? 600 : 400) : (isBn ? 500 : 500),
            lineHeight: isFeatured ? 1.25 : 1.4,
            color: "var(--text-primary)",
            margin: 0,
            flex: 1,
          }}
        >
          {article.headline}
        </h3>

        {isFeatured && (
          <p style={{
            fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            margin: 0,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {article.content}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}>
            {formatTimestamp(article.timestamp, lang)}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            <IconArrow />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── TOPBAR ─────────────────────────────────────────────────────────────────────
function TopBar() {
  const { theme, toggleTheme, language, switchLanguage, searchQuery, setSearchQuery } = useApp();
  const t = UI[language] || UI.en;
  const isBn = language === "bn";

  return (
    <nav className="topbar">
      <div className="vd-container" style={{ display: "flex", alignItems: "center", gap: "1rem", height: "56px" }}>

        {/* Logo */}
        <a className="vd-logo" href="#/" style={{ flexShrink: 0 }}>
          Vanguard <span>Daily</span>
        </a>

        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
          <span className="status-dot" />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}>
            {t.statusLine}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", pointerEvents: "none",
          }}>
            <IconSearch />
          </div>
          <input
            className="search-input"
            type="text"
            placeholder={t.searchPH}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : undefined }}
          />
        </div>

        {/* Language toggle */}
        <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
          {["en", "bn"].map((l) => (
            <button
              key={l}
              className={`lang-btn ${language === l ? "active" : ""}`}
              onClick={() => switchLanguage(l)}
            >
              {l === "en" ? "EN" : "বাং"}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "0.1rem", flexShrink: 0 }}>
          <a className="social-icon" href="https://x.com" target="_blank" rel="noopener noreferrer" title="X">
            <IconX />
          </a>
          <a className="social-icon" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <IconLinkedIn />
          </a>
          <a className="social-icon" href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
            <IconGitHub />
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ breakingArticles, onArticleClick, lang }) {
  const t = UI[lang] || UI.en;
  const isBn = lang === "bn";

  return (
    <aside className="sidebar">
      <div className="sidebar-label">{t.breakingFeed}</div>
      {breakingArticles.length === 0 ? (
        <div style={{ padding: "1.5rem 1.25rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
          No breaking dispatches.
        </div>
      ) : (
        breakingArticles.map((article) => (
          <div key={article.id} className="ticker-item" onClick={() => onArticleClick(article)}>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
              <CategoryBadge category={article.category} isBreaking={false} lang={lang} />
            </div>
            <p style={{
              fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
              fontSize: isBn ? "0.82rem" : "0.78rem",
              color: "var(--text-primary)",
              margin: "0 0 0.35rem 0",
              lineHeight: 1.4,
              fontWeight: 500,
            }}>
              {article.headline}
            </p>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}>
              {formatTimestamp(article.timestamp, lang)}
            </span>
          </div>
        ))
      )}
    </aside>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const FEED_LIMIT = 10;

export default function Dashboard({ archiveMode = false }) {
  const { language, searchQuery } = useApp();
  const lang = language || "en";
  const t = UI[lang] || UI.en;
  const navigate = useNavigate();

  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // ── Fetch news
  useEffect(() => {
    setLoading(true);
    const file = lang === "bn" ? "./news/intel_bn.json" : "./news/intel_en.json";
    fetch(file)
      .then((r) => r.json())
      .then((data) => {
        setAllArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Feed error:", err);
        setLoading(false);
      });
  }, [lang]);

  // ── Filter by search
  const filtered = searchQuery
    ? allArticles.filter((a) =>
        a.headline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allArticles;

  // ── Feed slicing
  const displayArticles = archiveMode ? filtered : filtered.slice(0, FEED_LIMIT);
  const hasMore = !archiveMode && filtered.length > FEED_LIMIT;

  // ── Breaking sidebar
  const breakingArticles = allArticles.filter((a) => a.isBreaking);

  // ── Article click
  const handleArticleClick = useCallback((article) => {
    setSelectedArticle(article);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  if (loading) {
    return (
      <>
        <TopBar />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "calc(100vh - 56px)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          <span className="status-dot" style={{ marginRight: "0.75rem" }} />
          ACQUIRING FEED…
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />

      <div className="vd-container" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
        {/* Archive mode banner */}
        {archiveMode && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "1.25rem",
            padding: "0.65rem 1rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "3px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <IconArchive />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}>
                SYSTEM ARCHIVE — {filtered.length} DISPATCHES
              </span>
            </div>
            <button
              onClick={() => navigate("/")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                cursor: "pointer",
                borderRadius: "2px",
                padding: "0.25rem 0.6rem",
              }}
            >
              ← MAIN FEED
            </button>
          </div>
        )}

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "0", alignItems: "start" }}>

          {/* Primary content */}
          <main style={{ paddingRight: "1.5rem", minWidth: 0 }}>

            {/* Section label */}
            <div className="section-divider">
              <span className="section-divider-label">
                {archiveMode ? "ARCHIVE" : "INTELLIGENCE FEED"}
              </span>
              <div className="section-divider-line" />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {displayArticles.length} DISPATCHES
              </span>
            </div>

            {/* Empty state */}
            {displayArticles.length === 0 && (
              <div className="empty-state">
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "0.35rem",
                }}>
                  {t.noResults}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                  {t.noResultsSub}
                </p>
              </div>
            )}

            {/* Bento grid */}
            {displayArticles.length > 0 && (
              <div className="bento-outer">
                <div className="bento-grid">
                  {displayArticles.map((article, idx) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onClick={handleArticleClick}
                      lang={lang}
                      isFeatured={idx === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Archive CTA */}
            {hasMore && (
              <button className="archive-btn" onClick={() => navigate("/archive")}>
                <IconArchive />
                {t.archiveBtn}
                <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.6rem" }}>
                  +{filtered.length - FEED_LIMIT}
                </span>
              </button>
            )}

            {/* Footer */}
            <footer className="vd-footer">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div className="status-bar">
                  <span className="status-dot" />
                  VANGUARD DAILY — INTELLIGENCE PORTAL — HASSAN GROUP LIMITED
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}>
                  © {new Date().getFullYear()} HASSAN GROUP LTD. ALL RIGHTS RESERVED.
                </span>
              </div>
            </footer>
          </main>

          {/* Sidebar */}
          <Sidebar
            breakingArticles={breakingArticles}
            onArticleClick={handleArticleClick}
            lang={lang}
          />
        </div>
      </div>

      {/* Article modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={handleCloseModal}
          lang={lang}
        />
      )}
    </>
  );
}
