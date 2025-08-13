import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Punto de entrada de la aplicación React

import App from "./App";
import { ToastProvider } from "./components/ui/ToastProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
