import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

// Punto de entrada de la aplicación React

import App from "./App";
import RequestsHistory from "./pages/RequestsHistory";
import RequestDetail from "./pages/RequestDetail";
import { ToastProvider } from "./components/ui/ToastProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/requests" element={<RequestsHistory />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);
