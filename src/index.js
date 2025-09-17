import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import RequestDetail from "./pages/RequestDetail";
import Confirm from "./pages/Confirm";
import "./styles.css";

// Punto de entrada de la aplicación React

import App from "./App";
import RequestsHistory from "./pages/RequestsHistory";
import RequestDetail from "./pages/RequestDetail";
import { ToastProvider } from "./components/ui/ToastProvider";
import { bootstrapDemoData } from "./utils/bootstrapDemoData";

// Inicializa datos de demostración en LocalStorage
// TODO backend: reemplazar con carga desde API al conectar el servidor real
bootstrapDemoData();

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/requests" element={<RequestsHistory />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/confirm" element={<Confirm />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);
