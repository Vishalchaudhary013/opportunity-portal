import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OpportunitiesProvider } from "./context/OpportunitiesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <OpportunitiesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </OpportunitiesProvider>
  </StrictMode>,
);
