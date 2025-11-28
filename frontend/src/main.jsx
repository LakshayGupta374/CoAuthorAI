import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 👉 Add Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// 👉 (Optional but recommended for dropdowns, modals, navbar toggler)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);