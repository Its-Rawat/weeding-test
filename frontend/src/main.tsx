import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import QRCodePage from "./pages/QRCodePage";
import "./styles/global.css";

function Root() {
  const path = window.location.pathname.toLowerCase();

  if (path.startsWith("/admin")) {
    return <AdminPage />;
  }

  if (path.startsWith("/qrcode")) {
    return <QRCodePage />;
  }

  return <App />;
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
}
