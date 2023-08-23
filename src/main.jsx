import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </NextUIProvider>
);
