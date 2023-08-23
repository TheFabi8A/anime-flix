import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";

import AnimeContextProvider from "./context/AnimeContextProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AnimeContextProvider>
    <NextUIProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </NextUIProvider>
  </AnimeContextProvider>,
);
