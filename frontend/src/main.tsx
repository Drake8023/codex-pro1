import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import App from "./app/App";
import { AppProviders } from "./app/providers/AppProviders";
import "./app/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>,
);
