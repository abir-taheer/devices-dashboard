import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./error/ErrorBoundary";
import "./index.css";
import SPContextProvider from "./sharepoint/SPContext";
import SPCon from "./sharepoint/SPContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <SPContextProvider>
      <App />
    </SPContextProvider>
  </ErrorBoundary>
);
