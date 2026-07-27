import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./App.css";

// Every route renders the same App; it reads the location to decide which view
// to show. Declaring them individually rather than relying on a single
// catch-all keeps the routing surface visible in one place.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/colours" element={<App />} />
        <Route path="/paint/:brand/:slug" element={<App />} />
        <Route path="/paints" element={<App />} />
        <Route path="/my-paints" element={<App />} />
        <Route path="/stores" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
