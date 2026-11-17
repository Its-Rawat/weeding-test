import React, { useEffect, useState } from "react";
import { LogOut, ArrowLeft, Heart, Sparkles, ShieldCheck } from "lucide-react";
import AdminDashboard from "../components/Admin/AdminDashboard";
import type { RSVP, Wish } from "../types";

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [credential, setCredential] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadData = async () => {
    try {
      const [rsvpRes, wishRes] = await Promise.all([
        fetch("/api/rsvp"),
        fetch("/api/wishes"),
      ]);
      if (rsvpRes.ok) {
        const rData = await rsvpRes.json();
        setRsvps(Array.isArray(rData) ? rData : []);
      }
      if (wishRes.ok) {
        const wData = await wishRes.json();
        setWishes(Array.isArray(wData) ? wData : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", credential }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setErrorMsg("Incorrect access key. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setIsAuthenticated(false);
      setRsvps([]);
      setWishes([]);
    } catch (e) {
      console.error(e);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700"></div>
          <p className="font-serif text-sm italic text-amber-900/60">Opening Wedding Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#231C18] antialiased">
      {!isAuthenticated ? (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-amber-900/10 bg-white p-8 sm:p-10 shadow-xl shadow-amber-900/5">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-3 border border-amber-200">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold italic text-[#231C18]">
                Wedding Host Portal
              </h1>
              <p className="mt-2 text-xs font-medium text-amber-900/60">
                Chandrika &amp; Xudong &bull; Wedding Celebration
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Enter your private host key to manage guest invitations and RSVPs.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-semibold text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Host Access Key
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Enter access key..."
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#8C1D24] to-[#750D14] px-4 py-3.5 text-xs font-bold tracking-wider text-white shadow-md shadow-[#8C1D24]/20 transition hover:from-[#750D14] hover:to-[#5E0A10] disabled:opacity-50 cursor-pointer"
              >
                {loading ? "VERIFYING..." : "ENTER DASHBOARD"}
              </button>
              <div className="text-center pt-2">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-800 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Wedding Website
                </a>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
          {/* Top Header */}
          <header className="mb-8 flex flex-col gap-4 border-b border-amber-900/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/15 bg-white px-3.5 py-1 text-xs font-semibold text-amber-900/80 shadow-2xs hover:bg-amber-50 hover:text-amber-950 transition"
                >
                  <ArrowLeft className="h-3 w-3" /> View Wedding Website
                </a>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  <Sparkles className="h-3 w-3" /> Host Portal
                </span>
              </div>
              <h1 className="mt-2 font-serif text-3xl font-bold italic sm:text-4xl text-[#231C18]">
                Chandrika &amp; Xudong
              </h1>
              <p className="mt-0.5 text-xs font-medium text-amber-900/60">
                14 &bull; 15 February 2027 &bull; Gurugram Wedding Celebrations
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-2xs transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </header>

          {/* Unified Host Dashboard with 5 simplified tabs */}
          <AdminDashboard
            initialRsvps={rsvps as any}
            initialWishes={wishes as any}
            siteUrl={window.location.origin}
          />
        </div>
      )}
    </main>
  );
};

export default AdminPage;
