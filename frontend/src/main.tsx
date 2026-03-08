import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { applyThemeById, getStoredThemeId } from "./utils/theme";
import { getDefaultPreset } from "./constants/themeColors";
import App from "./App.tsx";

applyThemeById(getStoredThemeId() ?? getDefaultPreset().id);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
