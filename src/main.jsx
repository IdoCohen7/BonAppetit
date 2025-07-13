// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  HashRouter
} from "react-router-dom";

import Start from "./pages/Start/Start.jsx";
import Menu from "./pages/Menu/Menu.jsx";
import Summary from "./pages/Summary/Summary.jsx";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";
import TrackPage from "./pages/Track/TrackPage.jsx";
import Callback from "./pages/Callback.jsx";

import TokenHandler from "./TokenHandler";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
    {/* <BrowserRouter> */}
      <TokenHandler>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TokenHandler>
      {/* </BrowserRouter> */}
    </HashRouter>
  </StrictMode>
);
