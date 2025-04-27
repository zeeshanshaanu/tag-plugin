import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
// ///////////////////////////////////////
// ///////////////////////////////////////
axios.defaults.baseURL = "https://amplify-api.tagmarkets.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
