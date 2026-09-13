import React from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { ArrowLeft } from "lucide-react";

export const QRCodePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-4xl italic text-slate-900 dark:text-white">
            QR Code Generator
          </h1>
          <p className="text-slate-500">
            Generate custom QR codes and personalized links for guests
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-slate-800">
          <QRCodeGenerator siteUrl={window.location.origin} />
        </div>

        <div className="text-center space-x-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase hover:text-slate-600 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </a>
          <a
            href="/"
            className="text-sm font-bold tracking-widest text-slate-400 uppercase hover:text-slate-600 dark:hover:text-white"
          >
            Visit Invitation &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
