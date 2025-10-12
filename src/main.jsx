import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { setLocale } from "./i18n-simple";
import { HashRouter } from "react-router-dom";

// Initialiser la locale depuis localStorage ou par défaut "fr"
const savedLocale = localStorage.getItem('todo-app-locale') || 'fr';
setLocale(savedLocale);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
