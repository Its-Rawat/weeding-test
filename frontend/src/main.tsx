import React, { Component, type ErrorInfo, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import QRCodePage from "./pages/QRCodePage";
import "./styles/global.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error in wedding app:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EB] text-[#231C18] p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#D4AF37]/30 space-y-3">
            <h2 className="font-serif italic text-2xl font-bold text-[#8C1D24]">
              Chandrika &amp; Xudong
            </h2>
            <p className="text-xs text-stone-600">
              We encountered a minor display issue loading the page.
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-red-600 bg-red-50 p-2 rounded-lg">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 inline-block px-6 py-2.5 bg-[#8C1D24] text-white rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#6E161C] transition cursor-pointer"
            >
              Reload Invitation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <Root />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
