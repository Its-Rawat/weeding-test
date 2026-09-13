import FileSaver from "file-saver";
import JSZip from "jszip";
import {
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  RefreshCcw,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useMemo, useRef, useState } from "react";

const QRCodeManager: React.FC<{ siteUrl: string }> = ({ siteUrl }) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [singleName, setSingleName] = useState("");
  const [bulkNames, setBulkNames] = useState<string[]>([]);
  const [isReadingCsv, setIsReadingCsv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [brideInitial, setBrideInitial] = useState("B");
  const [groomInitial, setGroomInitial] = useState("G");
  const qrRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.BRIDE_NICKNAME)
          setBrideInitial(data.BRIDE_NICKNAME.charAt(0).toUpperCase());
        if (data.GROOM_NICKNAME)
          setGroomInitial(data.GROOM_NICKNAME.charAt(0).toUpperCase());
      })
      .catch(() => {});
  }, []);

  const generateUrl = (name: string) => {
    if (!name) return baseUrl;
    return `${baseUrl}/?to=${encodeURIComponent(name.trim())}`;
  };

  const handleSaveAs = (blob: Blob | string, name: string) => {
    const saveAsFunc = (FileSaver as any).saveAs || FileSaver;
    saveAsFunc(blob, name);
  };

  const centerLogo = useMemo(() => {
    try {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B45309;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="#fdfbf7" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGradient)" stroke-width="2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e2d8ce" stroke-width="1" />
          <g font-family="'Playfair Display', 'Cormorant Garamond', Georgia, serif" font-weight="600" font-style="italic" font-size="38" fill="#26211e" text-anchor="middle">
             <text x="26" y="64">${brideInitial}</text>
             <text x="74" y="64">${groomInitial}</text>
          </g>
          <path d="M50 38 C 46 32, 36 33, 36 42 C 36 52, 50 64, 50 64 C 50 64, 64 52, 64 42 C 64 33, 54 32, 50 38 Z" fill="#d4af37" stroke="white" stroke-width="1.5" />
        </svg>
      `.trim();
      return `data:image/svg+xml;base64,${btoa(svgString)}`;
    } catch {
      return "";
    }
  }, [brideInitial, groomInitial]);

  const downloadTemplate = () => {
    const csvContent =
      "Guest Name\nJohn Doe & Family\nAlice Smith\nBob & Guest";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    handleSaveAs(blob, "guest_template.csv");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingCsv(true);
    setTimeout(() => {
      Papa.parse(file, {
        complete: (results) => {
          const names: string[] = [];
          results.data.forEach((row: any) => {
            if (row[0] && typeof row[0] === "string" && row[0].trim() !== "") {
              if (!row[0].toLowerCase().includes("guest name") && !row[0].toLowerCase().includes("nama tamu")) {
                names.push(row[0].trim());
              }
            }
          });
          setBulkNames(names);
          setIsReadingCsv(false);
        },
        header: false,
      });
    }, 100);
  };

  const downloadAllZip = async () => {
    if (bulkNames.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setStatusMsg("Preparing assets...");
    try {
      const zip = new JSZip();
      const folder = zip.folder("QR_Codes_Wedding");
      const CHUNK_SIZE = 50;
      for (let i = 0; i < bulkNames.length; i += CHUNK_SIZE) {
        const chunk = bulkNames.slice(i, i + CHUNK_SIZE);
        setStatusMsg(
          `Processing ${i + 1} - ${Math.min(i + chunk.length, bulkNames.length)} of ${bulkNames.length}...`
        );
        await Promise.all(
          chunk.map(async (name, chunkIdx) => {
            const globalIdx = i + chunkIdx;
            const canvas = qrRefs.current[globalIdx];
            if (canvas) {
              const dataUrl = canvas.toDataURL("image/png");
              const base64Data = dataUrl.split(",")[1];
              const safeName = name
                .replace(/[^a-z0-9]/gi, "_")
                .substring(0, 50);
              folder?.file(`${globalIdx + 1}_${safeName}.png`, base64Data, {
                base64: true,
              });
            }
          })
        );
        setProgress(Math.round(((i + chunk.length) / bulkNames.length) * 100));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      setStatusMsg("Compressing ZIP file...");
      const content = await zip.generateAsync({ type: "blob" });
      handleSaveAs(
        content,
        `QR-Codes-${new Date().toISOString().slice(0, 10)}.zip`
      );
      setStatusMsg("Complete!");
    } catch {
      alert("An error occurred while generating ZIP.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatusMsg("");
      }, 1000);
    }
  };

  const downloadSingle = () => {
    const canvas = document.getElementById("single-qr") as HTMLCanvasElement;
    if (canvas) {
      handleSaveAs(
        canvas.toDataURL("image/png"),
        `QR-${singleName || "Wedding"}.png`
      );
    }
  };

  const copySingleLink = () => {
    navigator.clipboard.writeText(generateUrl(singleName));
    alert("Link copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("single")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              activeTab === "single"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Single (Manual)
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              activeTab === "bulk"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Bulk (CSV Import)
          </button>
        </div>
      </div>

      {activeTab === "single" && (
        <div className="animate-reveal grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Guest Name
              </label>
              <input
                type="text"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                placeholder="Enter guest name..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs break-all text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              {generateUrl(singleName)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={copySingleLink}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
              >
                <Copy className="h-4 w-4" /> Copy Link
              </button>
              <button
                onClick={downloadSingle}
                disabled={!singleName}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white uppercase shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Download PNG
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <QRCodeCanvas
                id="single-qr"
                value={generateUrl(singleName)}
                size={250}
                level="H"
                includeMargin={true}
                imageSettings={
                  centerLogo
                    ? { src: centerLogo, height: 50, width: 50, excavate: true }
                    : undefined
                }
              />
              <div className="mt-4 text-center">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Design Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="animate-reveal space-y-8">
          {bulkNames.length === 0 ? (
            <div className="space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center md:p-10 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20">
                {isReadingCsv ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {isReadingCsv ? "Reading CSV File..." : "Upload CSV File"}
                </h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500">
                  Prepare a simple CSV file where the{" "}
                  <strong>first column</strong> contains the guest names.
                </p>
                <div className="flex justify-center pt-2">
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Download CSV Template
                  </button>
                </div>
              </div>
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`}
              >
                Select CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isReadingCsv}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    {bulkNames.length}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-blue-100">
                      Guests Ready
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Premium Design with Center Initials
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all data?"))
                        setBulkNames([]);
                    }}
                    className="group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <RefreshCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
                    Reset Data
                  </button>
                  <button
                    onClick={downloadAllZip}
                    disabled={isProcessing}
                    className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>
                        {isProcessing ? "Processing..." : "Download ZIP"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="animate-reveal space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{statusMsg}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {bulkNames.slice(0, 50).map((name, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="rounded-lg bg-white p-1">
                      <QRCodeCanvas
                        ref={(el) => (qrRefs.current[idx] = el)}
                        value={generateUrl(name)}
                        size={140}
                        level="H"
                        includeMargin={true}
                        imageSettings={
                          centerLogo
                            ? {
                                src: centerLogo,
                                height: 35,
                                width: 35,
                                excavate: true,
                              }
                            : undefined
                        }
                      />
                    </div>
                    <div className="w-full text-center">
                      <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">
                        {name}
                      </p>
                      <div className="mt-1 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                ))}
                {bulkNames.slice(50).map((name, idx) => (
                  <div key={idx + 50} className="hidden">
                    <QRCodeCanvas
                      ref={(el) => (qrRefs.current[idx + 50] = el)}
                      value={generateUrl(name)}
                      size={250}
                      level="H"
                      includeMargin={true}
                      imageSettings={
                        centerLogo
                          ? {
                              src: centerLogo,
                              height: 50,
                              width: 50,
                              excavate: true,
                            }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>

              {bulkNames.length > 50 && (
                <p className="text-center text-xs text-slate-400 italic">
                  ... and {bulkNames.length - 50} other QR codes (hidden for performance, but included in download).
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeManager;
