import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import OrderMethod from "./pages/OrderMethod/OrderMethod.jsx";
import Delivery from "./pages/Delivery/Delivery.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderMethod />} />
        <Route path="/delivery" element={<Delivery />} />
        {/* <Route path="/pickup" element={<Pickup />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
