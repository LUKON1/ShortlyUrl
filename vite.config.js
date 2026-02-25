import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
  build: {
    assetsDir: "assets",
  },
  server: {
    proxy: {
      // Proxy all short codes and custom aliases to the backend.
      // Matches any single-segment path with alphanumeric, hyphens, underscores (4+ chars),
      // but NOT known client-side routes.
      "^/(?!api|assets|public|priv|pau|exp|prof|reg|sign|share|about|faq|cont)[a-zA-Z0-9_-]{4,}$": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
