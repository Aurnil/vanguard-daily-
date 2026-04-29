import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ─── VITE CONFIGURATION ─────────────────────────────────────────────────────
// base: "./" — ensures all assets use relative paths, critical for gh-pages.
// HashRouter is used app-side; no server rewrites needed on static hosting.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
