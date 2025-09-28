import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "/src/style.css";
import App from "/src/elements/App";
import i18n from "./translation/i18n";
import { AuthProvider } from "./context/AuthProvider";

if (import.meta.env.VITE_MSW_ACTIVE === 'TRUE') {
  import('./mocks/browser')
    .then((module) => module.worker.start())
    .catch((err) => console.error('Failed to start service worker', err));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
