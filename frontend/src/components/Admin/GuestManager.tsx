import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Share2,
  RefreshCw,
  X,
  Plus,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import * as XLSX from "xlsx";

interface GuestMember {
  id: number;
  name: string;
  attending: boolean;
}

interface GuestItem {
  id: number;
  name: string;
  type: "FAMILY" | "INDIVIDUAL";
  token: string;
  rsvpLink: string;
  status: "ACTIVE" | "INACTIVE";
  rsvpStatus: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
  members: GuestMember[];
  allowedEvents: string[];
  message?: string;
  createdAt?: string;
  respondedAt?: string;
}

export const GuestManager: React.FC = () => {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Single Guest Form State
  const [guestName, setGuestName] = useState("");
  const [guestType, setGuestType] = useState<"FAMILY" | "INDIVIDUAL">("FAMILY");
  const [members, setMembers] = useState<string[]>([""]);
  const [allowedEvents, setAllowedEvents] = useState<string[]>(["MEHENDI", "HALDI", "WEDDING"]);

  // Bulk Upload State
  const [bulkParsed, setBulkParsed] = useState<any[]>([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadGuests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/guests", {
        headers: { "X-Admin-Key": "wedding2027" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGuests(Array.isArray(data) ? data : []);
      } else {
        setGuests([]);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to load guests from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleCopyLink = (token: string, rsvpLink: string) => {
    const fullUrl = rsvpLink || `${window.location.origin}/rsvp/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    showToast("RSVP link copied to clipboard!", "success");
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/guests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": "wedding2027",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setGuests((prev) =>
          prev.map((g) => (g.id === id ? { ...g, status: nextStatus as any } : g))
        );
        showToast(`Invitation marked as ${nextStatus}`, "success");
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteGuest = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete invitation for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": "wedding2027" },
      });
      if (res.ok || res.status === 204) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
        showToast(`Deleted invitation for ${name}`, "success");
      }
    } catch {
      showToast("Failed to delete guest", "error");
    }
  };

  // Add Single Guest
  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast("Please enter a guest name", "error");
      return;
    }

    setSaving(true);
    try {
      const filteredMembers = members.map((m) => m.trim()).filter(Boolean);
      const payload: any = {
        name: guestName.trim(),
        type: guestType,
        allowedEvents: allowedEvents.length > 0 ? allowedEvents : ["WEDDING"],
      };
      if (guestType === "FAMILY" && filteredMembers.length > 0) {
        payload.members = filteredMembers;
      }

      const res = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": "wedding2027",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setGuests((prev) => [created, ...prev]);
        showToast(`Successfully created invitation for "${created.name}"!`, "success");
        // Reset form
        setGuestName("");
        setGuestType("FAMILY");
        setMembers([""]);
        setAllowedEvents(["MEHENDI", "HALDI", "WEDDING"]);
        setIsAddModalOpen(false);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Failed to create guest", "error");
      }
    } catch {
      showToast("Network error creating guest", "error");
    } finally {
      setSaving(false);
    }
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        Name: "Sharma Family",
        Type: "FAMILY",
        Members: "Rajesh Sharma, Sunita Sharma, Rahul Sharma",
        Events: "MEHENDI, HALDI, WEDDING",
      },
      {
        Name: "Dr. Vikram Sethi",
        Type: "INDIVIDUAL",
        Members: "",
        Events: "HALDI, WEDDING",
      },
      {
        Name: "Pooja & Amit Verma",
        Type: "FAMILY",
        Members: "Pooja Verma, Amit Verma",
        Events: "WEDDING",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guests");
    XLSX.writeFile(wb, "Wedding_Guests_Template.xlsx");
    showToast("Downloaded sample Excel template!", "success");
  };

  // Handle Excel File Selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsed = rows.map((r) => {
          const name = r.Name || r.name || r["Guest Name"] || r["GUEST NAME"] || "";
          const rawType = (r.Type || r.type || "FAMILY").toUpperCase();
          const type = rawType.includes("IND") ? "INDIVIDUAL" : "FAMILY";

          const rawMembers = r.Members || r.members || r["Family Members"] || "";
          const membersList = typeof rawMembers === "string"
            ? rawMembers.split(",").map((m: string) => m.trim()).filter(Boolean)
            : [];

          const rawEvents = r.Events || r.events || r.Ceremonies || "MEHENDI, HALDI, WEDDING";
          const eventsList = typeof rawEvents === "string"
            ? rawEvents.split(",").map((ev: string) => ev.trim().toUpperCase()).filter(Boolean)
            : ["MEHENDI", "HALDI", "WEDDING"];

          return {
            name: String(name).trim(),
            type,
            members: membersList,
            allowedEvents: eventsList.length > 0 ? eventsList : ["WEDDING"],
          };
        }).filter((item) => item.name);

        setBulkParsed(parsed);
      } catch (err) {
        console.error(err);
        showToast("Error parsing Excel file. Please use standard columns.", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Execute Bulk Upload to Server
  const handleBulkImportSubmit = async () => {
    if (bulkParsed.length === 0) return;
    setIsImporting(true);
    try {
      const res = await fetch("/api/guests/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": "wedding2027",
        },
        body: JSON.stringify(bulkParsed),
      });

      if (res.ok) {
        const createdList = await res.json();
        showToast(`Successfully uploaded ${createdList.length} invitations to Hostinger!`, "success");
        setIsBulkModalOpen(false);
        setBulkParsed([]);
        setBulkFileName("");
        loadGuests();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Failed to bulk import guests", "error");
      }
    } catch {
      showToast("Network error uploading guests", "error");
    } finally {
      setIsImporting(false);
    }
  };

  // Export Full Guests List to Excel
  const handleExportGuests = () => {
    if (guests.length === 0) {
      showToast("No guests to export", "error");
      return;
    }

    const exportRows = guests.map((g, i) => {
      const link = g.rsvpLink || `${window.location.origin}/rsvp/${g.token}`;
      return {
        "S.No": i + 1,
        "Guest / Family Name": g.name,
        "Type": g.type,
        "Personalized RSVP Link": link,
        "Token": g.token,
        "Allowed Ceremonies": g.allowedEvents.join(", "),
        "Attendance Status": g.rsvpStatus,
        "Family Members": g.members.map((m) => m.name + (m.attending ? " (Attending)" : "")).join(", "),
        "Link Status": g.status,
        "Message": g.message || "",
        "Responded Date": g.respondedAt || "",
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Wedding Guests");
    XLSX.writeFile(wb, `Chandrika_Xudong_Guests_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Exported guest list to Excel!", "success");
  };

  // Filtering
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.token.toLowerCase().includes(search.toLowerCase()) ||
      g.members.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ATTENDING" && g.rsvpStatus === "ATTENDING") ||
      (statusFilter === "PENDING" && g.rsvpStatus === "PENDING") ||
      (statusFilter === "NOT_ATTENDING" && g.rsvpStatus === "NOT_ATTENDING");

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.rsvpStatus === "ATTENDING");
  const attendingPax = attendingGuests.reduce((acc, g) => {
    const checked = g.members.filter((m) => m.attending).length;
    return acc + (checked > 0 ? checked : 1);
  }, 0);
  const pendingCount = guests.filter((g) => g.rsvpStatus === "PENDING").length;
  const declinedCount = guests.filter((g) => g.rsvpStatus === "NOT_ATTENDING").length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl transition-all duration-300 animate-slide-up ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Invitations
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-slate-900 dark:text-white">
            {totalGuests}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Confirmed Attending
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {attendingGuests.length}{" "}
            <span className="text-xs font-sans text-emerald-600/70 font-normal">({attendingPax} Pax)</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Awaiting Response
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Declined
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">
            {declinedCount}
          </p>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Users className="h-4 w-4" />
            </span>
            <h2 className="font-serif text-xl font-bold italic text-slate-900 dark:text-white">
              Guests &amp; Personalized Invitations
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Stored in Hostinger MySQL (`guest_invitations`). Each guest gets a personalized RSVP link with custom ceremony access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadGuests}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            title="Refresh from database"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>

          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-amber-600" /> Bulk Upload (Excel)
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> + Add Guest
          </button>

          <button
            type="button"
            onClick={handleExportGuests}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            title="Export full list to Excel (.xlsx)"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, member, or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-xs outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ATTENDING", "PENDING", "NOT_ATTENDING"].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === filterKey
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {filterKey === "ALL"
                ? "All Guests"
                : filterKey === "ATTENDING"
                ? "Attending"
                : filterKey === "PENDING"
                ? "Pending"
                : "Declined"}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <p className="mt-3 text-xs text-slate-500">Loading guests from Hostinger MySQL...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h4 className="mt-3 font-serif text-base font-bold text-slate-700 dark:text-slate-300">
              No guests found
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Click <strong>&quot;+ Add Guest&quot;</strong> or <strong>&quot;Bulk Upload (Excel)&quot;</strong> above to add invitations!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-900/60 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Guest / Family</th>
                  <th className="py-3.5 px-4">Ceremonies</th>
                  <th className="py-3.5 px-4">Personalized RSVP Link</th>
                  <th className="py-3.5 px-4">Response</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredGuests.map((g, idx) => {
                  const link = g.rsvpLink || `${window.location.origin}/rsvp/${g.token}`;
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                          {g.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                            g.type === "FAMILY"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/50"
                          }`}>
                            {g.type}
                          </span>
                          {g.members && g.members.length > 0 && (
                            <span className="text-[11px] text-slate-400">
                              ({g.members.length} members)
                            </span>
                          )}
                        </div>
                        {g.members && g.members.length > 0 && (
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {g.members.map((m) => m.name).join(", ")}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {g.allowedEvents?.map((ev) => (
                            <span
                              key={ev}
                              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                ev.includes("MEH")
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : ev.includes("HAL")
                                  ? "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300"
                                  : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-300"
                              }`}
                            >
                              {ev.includes("MEH") ? "Mehendi" : ev.includes("HAL") ? "Haldi" : "Wedding"}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                            /rsvp/{g.token}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(g.token, link)}
                            className="p-1 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                            title="Copy full invitation link"
                          >
                            {copiedToken === g.token ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 transition"
                            title="Preview invitation page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            g.rsvpStatus === "ATTENDING"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : g.rsvpStatus === "NOT_ATTENDING"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                          }`}
                        >
                          {g.rsvpStatus === "ATTENDING"
                            ? "Attending"
                            : g.rsvpStatus === "NOT_ATTENDING"
                            ? "Declined"
                            : "Pending"}
                        </span>
                        {g.message && (
                          <p className="mt-1 text-[10px] italic text-slate-400 max-w-[180px] truncate">
                            &quot;{g.message}&quot;
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(g.id, g.status)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                            g.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-200 text-slate-600"
                          }`}
                          title="Click to enable or disable link"
                        >
                          {g.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Dear ${g.name}, with immense joy Chandrika and Xudong invite you to celebrate their wedding!\n\nPlease view your personalized invitation and confirm your attendance here:\n${link}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="h-4 w-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(g.id, g.name)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete guest invitation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Add Single Guest */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold italic text-slate-900 dark:text-white">
                  Add Guest / Family Invitation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="space-y-4">
              {/* Guest / Family Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sharma Family or Dr. Rahul Verma"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Invitation Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Invitation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestType("FAMILY")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      guestType === "FAMILY"
                        ? "border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <p className="text-xs">Family Invitation</p>
                    <p className="text-[10px] text-slate-400 font-normal">Multiple member names</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuestType("INDIVIDUAL")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      guestType === "INDIVIDUAL"
                        ? "border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <p className="text-xs">Individual Guest</p>
                    <p className="text-[10px] text-slate-400 font-normal">Single attendee</p>
                  </button>
                </div>
              </div>

              {/* Family Members Inputs */}
              {guestType === "FAMILY" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Family Members:
                    </label>
                    <button
                      type="button"
                      onClick={() => setMembers([...members, ""])}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Member
                    </button>
                  </div>

                  {members.map((mem, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={mem}
                        onChange={(e) => {
                          const updated = [...members];
                          updated[index] = e.target.value;
                          setMembers(updated);
                        }}
                        placeholder={`Member #${index + 1} name`}
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setMembers(members.filter((_, i) => i !== index))}
                          className="p-2 text-slate-400 hover:text-rose-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Allowed Ceremonies Checkboxes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Invited Ceremonies (Itinerary Access)
                </label>
                <div className="space-y-2">
                  {[
                    { id: "MEHENDI", label: "Mehendi Ceremony (Sun, 14 Feb 2027)" },
                    { id: "HALDI", label: "Haldi Ceremony (Mon, 15 Feb Morning)" },
                    { id: "WEDDING", label: "Wedding Ceremony & Pheras (Mon, 15 Feb Evening)" },
                  ].map((ceremony) => {
                    const isChecked = allowedEvents.includes(ceremony.id);
                    return (
                      <label
                        key={ceremony.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-750 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAllowedEvents([...allowedEvents, ceremony.id]);
                            } else {
                              setAllowedEvents(allowedEvents.filter((ev) => ev !== ceremony.id));
                            }
                          }}
                          className="h-4 w-4 accent-amber-600 rounded"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {ceremony.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !guestName.trim()}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save &amp; Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk Upload Excel */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold italic text-slate-900 dark:text-white">
                  Bulk Upload Guests via Excel (.xlsx)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Template Download Prompt */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Need the Excel template format?
                  </p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                    Columns: Name, Type (Family/Individual), Members, Events
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-xs hover:bg-amber-100 transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download Template
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-amber-500 hover:bg-slate-50/50 dark:border-slate-600 dark:hover:bg-slate-750 transition cursor-pointer"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
                <Upload className="mx-auto h-10 w-10 text-amber-600" />
                <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {bulkFileName ? bulkFileName : "Click or drag & drop Excel (.xlsx or .csv) file here"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Supports standard Excel worksheets</p>
              </div>

              {/* Preview parsed rows */}
              {bulkParsed.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Parsed {bulkParsed.length} Guests Ready to Import:
                    </p>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs dark:border-slate-700 dark:bg-slate-900/50">
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {bulkParsed.slice(0, 10).map((row, i) => (
                        <li key={i} className="py-1.5 px-2 flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {row.name} ({row.type})
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {row.members?.length ? `${row.members.length} members` : "1 pax"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {bulkParsed.length > 10 && (
                      <p className="text-[10px] text-slate-400 text-center py-1">
                        ...and {bulkParsed.length - 10} more rows
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkImportSubmit}
                  disabled={isImporting || bulkParsed.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import {bulkParsed.length > 0 ? `${bulkParsed.length} Guests` : ""} to Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestManager;
