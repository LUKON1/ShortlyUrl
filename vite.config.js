import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import clientRoutes from "./shared/clientRoutes.json";

// Build exclusion list from known client-side routes (strip leading slash)
const clientPaths = Object.values(clientRoutes)
  .map((r) => r.replace(/^\//, ""))
  .filter(Boolean);
// Escape for use in regex alternation
const excluded = clientPaths.join("|");

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
      // Proxy short codes and custom aliases to the backend.
      // Automatically excludes all paths defined in clientRoutes.json.
      [`^/(?!api|assets|${excluded})[a-zA-Z0-9_-]{4,}$`]: {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
