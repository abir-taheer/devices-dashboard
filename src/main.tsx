import ReactDOM from "react-dom/client";
import App from "./App";
import { SPContextProvider } from "./comps/context/SPContext";
import ErrorBoundary from "./error/ErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <SPContextProvider>
      <App />
    </SPContextProvider>
  </ErrorBoundary>
);
