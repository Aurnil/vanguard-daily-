/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Disable built-in dark mode — we manage theme via CSS custom properties
  // and data-theme attribute to avoid class conflicts and FOUC.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "Hind Siliguri", "sans-serif"],
        bangla: ["Hind Siliguri", "sans-serif"],
      },
      colors: {
        // Expose CSS variables as Tailwind utilities
        "vd-bg":          "var(--bg-base)",
        "vd-card":        "var(--bg-card)",
        "vd-border":      "var(--border)",
        "vd-text":        "var(--text-primary)",
        "vd-muted":       "var(--text-muted)",
        "vd-secondary":   "var(--text-secondary)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-in-out",
      },
    },
  },
  plugins: [],
};
