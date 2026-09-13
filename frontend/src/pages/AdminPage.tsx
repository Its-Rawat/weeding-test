import React, { useEffect, useState } from "react";
import { CheckCircle2, HelpCircle, LogOut, Users, XCircle, ArrowLeft } from "lucide-react";
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
        setRsvps(rData);
      }
      if (wishRes.ok) {
        const wData = await wishRes.json();
        setWishes(wData);
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
        setErrorMsg("Invalid credentials. Please try again.");
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
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800 dark:border-white/20 dark:border-t-white"></div>
      </div>
    );
  }

  const stats = {
    total: rsvps.length,
    hadir: rsvps.filter((r) => r.attendance === "hadir").length,
    ragu: rsvps.filter((r) => r.attendance === "ragu").length,
    tidak: rsvps.filter((r) => r.attendance === "tidak_hadir").length,
    guestCount: rsvps
      .filter((r) => r.attendance === "hadir")
      .reduce((sum, r) => sum + (r.guest_count || 1), 0),
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {!isAuthenticated ? (
        <div className="flex h-screen w-full items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-800">
            <div className="text-center">
              <h1 className="font-serif text-3xl font-bold italic text-slate-900 dark:text-white">
                Admin Access
              </h1>
              <p className="mt-2 text-xs text-slate-500">
                Chandrika &amp; Xudong Wedding Dashboard
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <input
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-4 text-slate-900 outline-none focus:border-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Enter access key..."
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-4 text-sm font-bold text-white transition-opacity hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {loading ? "Verifying..." : "ENTER DASHBOARD"}
              </button>
              <div className="text-center">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase hover:text-slate-600 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Invitation
                </a>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  <ArrowLeft className="h-3 w-3" /> View Website
                </a>
              </div>
              <h1 className="mt-2 font-serif text-3xl font-bold italic md:text-4xl">
                Wedding Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chandrika &amp; Xudong &bull; Admin Management
              </p>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" /> LOGOUT
            </button>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <Users className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">Total Responses</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-3 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">Attending</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.hadir}
                </span>
                <span className="text-lg font-medium text-slate-400">
                  ({stats.guestCount} Pax)
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-3 text-yellow-500">
                <HelpCircle className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">Tentative</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats.ragu}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-3 text-red-500">
                <XCircle className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">Declined</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats.tidak}
              </p>
            </div>
          </div>

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
