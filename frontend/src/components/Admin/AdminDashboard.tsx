import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Edit,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Music,
  Printer,
  QrCode,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { invalidateConfigCache } from "../../hooks/useConfig";
import InvitationManager from "../InvitationManager";
import QRCodeManager from "../QRCodeManager";
import MusicManager from "./MusicManager";
import GuestManager from "./GuestManager";

interface RSVP {
  id: number;
  guest_name: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  guest_count: number;
  message: string;
  created_at: string;
}

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const DataTable = <T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onBulkDelete,
}: {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);
  useEffect(() => {
    setSelected([]);
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(paginatedData.map((d) => d.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const executeBulkDelete = () => {
    if (onBulkDelete && selected.length > 0) {
      if (confirm(`Are you sure you want to delete ${selected.length} selected items?`)) {
        onBulkDelete(selected);
        setSelected([]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-xl border border-amber-900/15 bg-white px-3 py-2 text-xs font-medium text-amber-950 outline-none shadow-2xs focus:ring-2 focus:ring-amber-500/20"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          {onBulkDelete && selected.length > 0 && (
            <button
              type="button"
              onClick={executeBulkDelete}
              className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.length})
            </button>
          )}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-amber-900/15 bg-white py-2 pr-4 pl-9 text-xs text-slate-800 outline-none shadow-2xs focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[10px] font-bold text-amber-900/70 uppercase tracking-wider border-b border-amber-900/10">
              <tr>
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      selected.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5 rounded accent-amber-700"
                  />
                </th>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-4 py-3.5 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3.5 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/5">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="py-12 text-center text-slate-400"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-amber-50/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        className="h-3.5 w-3.5 rounded accent-amber-700"
                      />
                    </td>
                    {columns.map((col, idx) => (
                      <td key={idx} className="px-4 py-3">
                        {typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as any)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-800 transition cursor-pointer"
                              title="Edit item"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-amber-900/10 px-4 py-3 text-xs text-amber-900/70">
          <div>
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (page - 1) * pageSize + 1}{" "}
            to {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length} records
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-1 text-slate-400 hover:bg-amber-50 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-1 text-slate-400 hover:bg-amber-50 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Human-Friendly Settings Tab (Zero Raw JSON Required)
// -------------------------------------------------------------

const SettingsTab: React.FC = () => {
  const [rawConfig, setRawConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/config/full", { credentials: "include" })
      .then((r) => r.json())
      .then((full) => {
        setRawConfig(full || {});
        setLoading(false);
      })
      .catch(() => {
        fetch("/api/config", { credentials: "include" })
          .then((r) => r.json())
          .then((data) => {
            setRawConfig(data || {});
            setLoading(false);
          });
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setRawConfig((prev) => ({ ...prev, [key]: value }));
    if (jsonErrors[key]) {
      setJsonErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateJson = (key: string, value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      setJsonErrors((prev) => ({ ...prev, [key]: "Invalid JSON format" }));
      return false;
    }
  };

  const handleSave = async () => {
    const jsonFields = ["BANK_ACCOUNTS", "LOVE_STORY", "GALLERY_IMAGES", "PLAYLIST_TRACKS"];
    let hasError = false;
    for (const key of jsonFields) {
      if (rawConfig[key] && !validateJson(key, rawConfig[key])) {
        hasError = true;
      }
    }
    if (hasError) return;

    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(rawConfig),
      });
      if (res.ok) {
        invalidateConfigCache();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
        <p className="mt-3 text-xs font-medium text-amber-900/60">Loading wedding details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Save Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-900/10 bg-white p-5 sm:p-6 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold italic text-[#231C18]">
            Wedding Details &amp; Schedule
          </h2>
          <p className="mt-1 text-xs text-amber-900/60">
            Edit couple information, ceremony times, and venue details. Changes take effect on the invitation immediately.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
            saved
              ? "bg-emerald-600 shadow-emerald-600/20"
              : "bg-gradient-to-r from-[#8C1D24] to-[#750D14] hover:from-[#750D14] hover:to-[#5E0A10] shadow-[#8C1D24]/20"
          }`}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved Successfully!" : "Save All Changes"}
        </button>
      </div>

      {/* Card 1: The Couple */}
      <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Heart className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-serif text-lg font-bold italic text-[#231C18]">
            The Couple
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Bride Nickname / First Name
            </label>
            <input
              type="text"
              value={rawConfig.BRIDE_NICKNAME ?? ""}
              onChange={(e) => handleChange("BRIDE_NICKNAME", e.target.value)}
              placeholder="e.g. Chandrika"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Bride Full Name
            </label>
            <input
              type="text"
              value={rawConfig.BRIDE_FULLNAME ?? ""}
              onChange={(e) => handleChange("BRIDE_FULLNAME", e.target.value)}
              placeholder="e.g. Chandrika Rawat"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Groom Nickname / First Name
            </label>
            <input
              type="text"
              value={rawConfig.GROOM_NICKNAME ?? ""}
              onChange={(e) => handleChange("GROOM_NICKNAME", e.target.value)}
              placeholder="e.g. Xudong"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Groom Full Name
            </label>
            <input
              type="text"
              value={rawConfig.GROOM_FULLNAME ?? ""}
              onChange={(e) => handleChange("GROOM_FULLNAME", e.target.value)}
              placeholder="e.g. Xudong Wang"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Bride&apos;s Parents
            </label>
            <input
              type="text"
              value={rawConfig.BRIDE_PARENTS ?? ""}
              onChange={(e) => handleChange("BRIDE_PARENTS", e.target.value)}
              placeholder="e.g. Beloved daughter of Mr. &amp; Mrs. Sharma"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Groom&apos;s Parents
            </label>
            <input
              type="text"
              value={rawConfig.GROOM_PARENTS ?? ""}
              onChange={(e) => handleChange("GROOM_PARENTS", e.target.value)}
              placeholder="e.g. Beloved son of Mr. &amp; Mrs. Wang"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Bride Instagram (without @)
            </label>
            <input
              type="text"
              value={rawConfig.BRIDE_INSTAGRAM ?? ""}
              onChange={(e) => handleChange("BRIDE_INSTAGRAM", e.target.value)}
              placeholder="e.g. chandrika_r"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Groom Instagram (without @)
            </label>
            <input
              type="text"
              value={rawConfig.GROOM_INSTAGRAM ?? ""}
              onChange={(e) => handleChange("GROOM_INSTAGRAM", e.target.value)}
              placeholder="e.g. xudong_w"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Venue & Location */}
      <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-serif text-lg font-bold italic text-[#231C18]">
            Wedding Venue &amp; Location
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={rawConfig.VENUE_NAME ?? ""}
              onChange={(e) => handleChange("VENUE_NAME", e.target.value)}
              placeholder="e.g. The Club International"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Full Address
            </label>
            <textarea
              rows={2}
              value={rawConfig.VENUE_ADDRESS ?? ""}
              onChange={(e) => handleChange("VENUE_ADDRESS", e.target.value)}
              placeholder="e.g. Sector 109, Palam Vihar, Gurugram, Haryana 122017"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
                Map Latitude
              </label>
              <input
                type="text"
                value={rawConfig.VENUE_LAT ?? ""}
                onChange={(e) => handleChange("VENUE_LAT", e.target.value)}
                placeholder="28.5134"
                className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs font-mono text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
                Map Longitude
              </label>
              <input
                type="text"
                value={rawConfig.VENUE_LNG ?? ""}
                onChange={(e) => handleChange("VENUE_LNG", e.target.value)}
                placeholder="77.0275"
                className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs font-mono text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Ceremony Schedule & Timings */}
      <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-serif text-lg font-bold italic text-[#231C18]">
            Ceremony Schedule &amp; Timings
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              🌿 Mehendi Ceremony
            </label>
            <input
              type="text"
              value={rawConfig.TIME_MEHENDI ?? ""}
              onChange={(e) => handleChange("TIME_MEHENDI", e.target.value)}
              placeholder="e.g. 10:00 AM or 04:00 PM onwards"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              🌼 Haldi Ceremony
            </label>
            <input
              type="text"
              value={rawConfig.TIME_HALDI ?? ""}
              onChange={(e) => handleChange("TIME_HALDI", e.target.value)}
              placeholder="e.g. 03:00 PM onwards"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              🎺 Baraat Procession
            </label>
            <input
              type="text"
              value={rawConfig.TIME_BARAAT ?? ""}
              onChange={(e) => handleChange("TIME_BARAAT", e.target.value)}
              placeholder="e.g. 07:00 PM"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              👑 Wedding Ceremony (Mandap &amp; Pheras)
            </label>
            <input
              type="text"
              value={rawConfig.TIME_WEDDING ?? ""}
              onChange={(e) => handleChange("TIME_WEDDING", e.target.value)}
              placeholder="e.g. 08:30 PM"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Wedding Day &amp; Date
            </label>
            <input
              type="text"
              value={rawConfig.AKAD_DATE ?? ""}
              onChange={(e) => handleChange("AKAD_DATE", e.target.value)}
              placeholder="e.g. 15 February 2027"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Wedding Day Name
            </label>
            <input
              type="text"
              value={rawConfig.AKAD_DAY ?? ""}
              onChange={(e) => handleChange("AKAD_DAY", e.target.value)}
              placeholder="e.g. Monday"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Card 4: Greetings & Love Quotes */}
      <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-serif text-lg font-bold italic text-[#231C18]">
            Greetings &amp; Blessing Quotes
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Opening Salutation
            </label>
            <input
              type="text"
              value={rawConfig.TEXT_SALAM_OPENING ?? ""}
              onChange={(e) => handleChange("TEXT_SALAM_OPENING", e.target.value)}
              placeholder="e.g. Together with our families, we cordially invite you"
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Love Quote / Blessing Text
            </label>
            <textarea
              rows={3}
              value={rawConfig.TEXT_QUOTE_AR_RUM ?? ""}
              onChange={(e) => handleChange("TEXT_QUOTE_AR_RUM", e.target.value)}
              placeholder="Two souls with but a single thought, two hearts that beat as one..."
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
                Quote Caption / Title
              </label>
              <input
                type="text"
                value={rawConfig.TEXT_QUOTE_SOURCE ?? ""}
                onChange={(e) => handleChange("TEXT_QUOTE_SOURCE", e.target.value)}
                placeholder="A Celebration of Love &amp; Unity"
                className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
                Family Signature Sign-Off
              </label>
              <input
                type="text"
                value={rawConfig.TEXT_FAMILY ?? ""}
                onChange={(e) => handleChange("TEXT_FAMILY", e.target.value)}
                placeholder="e.g. Warmly Hosted by Aditya Rawat &amp; Family"
                className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Invitation Note
            </label>
            <textarea
              rows={2}
              value={rawConfig.TEXT_INVITATION ?? ""}
              onChange={(e) => handleChange("TEXT_INVITATION", e.target.value)}
              placeholder="With immense joy and grateful hearts, we invite you to share in our happiness..."
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70 mb-1">
              Closing Thank You Message
            </label>
            <textarea
              rows={2}
              value={rawConfig.TEXT_CLOSING ?? ""}
              onChange={(e) => handleChange("TEXT_CLOSING", e.target.value)}
              placeholder="Your blessings, presence, and prayers mean everything to us..."
              className="w-full rounded-xl border border-amber-900/15 bg-white p-3 text-xs text-slate-800 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Card 5: Optional Advanced Settings (Collapsible) */}
      <div className="rounded-3xl border border-amber-900/10 bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-amber-50/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Settings className="h-3.5 w-3.5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-bold italic text-[#231C18]">
                Advanced Developer &amp; Automation Settings
              </h3>
              <p className="text-[11px] text-slate-400">
                Optional: Telegram notification bot tokens, raw JSON arrays, and ISO timestamps.
              </p>
            </div>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-6 pt-0 border-t border-amber-900/10 space-y-4">
            <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/50 text-[11px] text-amber-800">
              Note: These fields configure background integrations and raw widgets. Regular hosts do not need to change these.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  value={rawConfig.TELEGRAM_BOT_TOKEN ?? ""}
                  onChange={(e) => handleChange("TELEGRAM_BOT_TOKEN", e.target.value)}
                  placeholder="123456:ABC..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={rawConfig.TELEGRAM_CHAT_ID ?? ""}
                  onChange={(e) => handleChange("TELEGRAM_CHAT_ID", e.target.value)}
                  placeholder="7671009829"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Bank &amp; Registry Accounts (JSON)
              </label>
              <textarea
                rows={3}
                value={rawConfig.BANK_ACCOUNTS ?? ""}
                onChange={(e) => handleChange("BANK_ACCOUNTS", e.target.value)}
                placeholder="[]"
                className={`w-full rounded-xl border bg-slate-50 p-3 text-xs font-mono outline-none ${
                  jsonErrors.BANK_ACCOUNTS ? "border-red-400" : "border-slate-200"
                }`}
              />
              {jsonErrors.BANK_ACCOUNTS && (
                <p className="mt-1 text-[11px] text-red-600">{jsonErrors.BANK_ACCOUNTS}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Love Story Timeline (JSON)
              </label>
              <textarea
                rows={3}
                value={rawConfig.LOVE_STORY ?? ""}
                onChange={(e) => handleChange("LOVE_STORY", e.target.value)}
                placeholder="[]"
                className={`w-full rounded-xl border bg-slate-50 p-3 text-xs font-mono outline-none ${
                  jsonErrors.LOVE_STORY ? "border-red-400" : "border-slate-200"
                }`}
              />
              {jsonErrors.LOVE_STORY && (
                <p className="mt-1 text-[11px] text-red-600">{jsonErrors.LOVE_STORY}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Photo Gallery (JSON)
              </label>
              <textarea
                rows={3}
                value={rawConfig.GALLERY_IMAGES ?? ""}
                onChange={(e) => handleChange("GALLERY_IMAGES", e.target.value)}
                placeholder="[]"
                className={`w-full rounded-xl border bg-slate-50 p-3 text-xs font-mono outline-none ${
                  jsonErrors.GALLERY_IMAGES ? "border-red-400" : "border-slate-200"
                }`}
              />
              {jsonErrors.GALLERY_IMAGES && (
                <p className="mt-1 text-[11px] text-red-600">{jsonErrors.GALLERY_IMAGES}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
            saved
              ? "bg-emerald-600 shadow-emerald-600/20"
              : "bg-gradient-to-r from-[#8C1D24] to-[#750D14] hover:from-[#750D14] hover:to-[#5E0A10] shadow-[#8C1D24]/20"
          }`}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved Successfully!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Main Admin Dashboard Component (5 Human-Friendly Categories)
// -------------------------------------------------------------

export const AdminDashboard = ({
  initialRsvps,
  initialWishes,
  siteUrl,
}: {
  initialRsvps: RSVP[];
  initialWishes: Wish[];
  siteUrl: string;
}) => {
  const [activeTab, setActiveTab] = useState<
    "guests" | "wishes" | "music" | "print" | "settings"
  >("guests");

  // Guests sub-view: VIP Personalized vs Open Public RSVPs
  const [guestSubTab, setGuestSubTab] = useState<"vip" | "public">("vip");

  // Print sub-view: Table QR codes vs Printable PDF cards
  const [printSubTab, setPrintSubTab] = useState<"qr" | "pdf">("qr");

  const [rsvps, setRsvps] = useState(initialRsvps);
  const [wishes, setWishes] = useState(initialWishes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (type: "rsvp" | "wish", ids: number[]) => {
    if (ids.length === 0) return;
    setIsDeleting(true);
    try {
      const actionKey = type === "rsvp" ? "delete_rsvp" : "delete_wish";
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionKey, ids }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (type === "rsvp")
          setRsvps((prev) => prev.filter((i) => !ids.includes(i.id)));
        if (type === "wish")
          setWishes((prev) => prev.filter((i) => !ids.includes(i.id)));
      } else {
        alert("Failed to delete: " + (json.error || "Unknown Error"));
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (type: "rsvp" | "wish", id: number, data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type === "rsvp" ? "update_rsvp" : "update_wish",
          id,
          data,
        }),
      });
      if (res.ok) {
        if (type === "rsvp") {
          setRsvps((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
          );
        } else {
          setWishes((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...data } : item))
          );
        }
        setIsModalOpen(false);
      } else {
        alert("Failed to update data.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "guests", label: "Guests & Invitations", icon: Users },
    { id: "wishes", label: "Wishes & Blessings", icon: Heart },
    { id: "music", label: "Music & Songs", icon: Music },
    { id: "print", label: "Print & QR Codes", icon: Printer },
    { id: "settings", label: "Wedding Details", icon: Settings },
  ];

  return (
    <div>
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
            <span className="text-sm font-bold text-slate-800">
              Removing record...
            </span>
          </div>
        </div>
      )}

      {/* 5 Main Category Tabs */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl bg-amber-900/5 p-1.5 border border-amber-900/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#8C1D24] to-[#750D14] text-white shadow-md shadow-[#8C1D24]/20"
                  : "text-amber-950/70 hover:text-amber-950 hover:bg-amber-900/5"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Guests & Invitations */}
      {activeTab === "guests" && (
        <div className="space-y-4">
          {/* Sub-view switcher for Personalized vs Public RSVPs */}
          <div className="flex items-center justify-between pb-1">
            <div className="inline-flex rounded-xl bg-white border border-amber-900/10 p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setGuestSubTab("vip")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  guestSubTab === "vip"
                    ? "bg-amber-100/70 text-amber-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Personalized Guest Invitations
              </button>
              <button
                type="button"
                onClick={() => setGuestSubTab("public")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  guestSubTab === "public"
                    ? "bg-amber-100/70 text-amber-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" /> Public Website RSVPs ({rsvps.length})
              </button>
            </div>
          </div>

          {guestSubTab === "vip" ? (
            <GuestManager />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                <div>
                  <h3 className="font-serif text-base font-bold italic text-[#231C18]">
                    Public Website RSVP Submissions
                  </h3>
                  <p className="text-xs text-amber-900/60">
                    Responses received directly from the open RSVP form on the website.
                  </p>
                </div>
                <a
                  href="/api/export-rsvp"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </a>
              </div>

              <DataTable
                data={rsvps}
                columns={[
                  {
                    header: "Guest Name",
                    accessor: "guest_name",
                    className: "font-semibold text-slate-900",
                  },
                  {
                    header: "Attendance",
                    accessor: (item) => (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.attendance === "hadir"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.attendance === "tidak_hadir"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.attendance === "hadir"
                          ? "Attending"
                          : item.attendance === "tidak_hadir"
                          ? "Cannot Attend"
                          : "Tentative"}
                      </span>
                    ),
                  },
                  {
                    header: "Pax",
                    accessor: (item) => (
                      <span className="font-medium text-slate-700">
                        {item.guest_count}
                      </span>
                    ),
                  },
                  {
                    header: "Message",
                    accessor: (item) => (
                      <span className="block max-w-[240px] truncate text-slate-500 italic">
                        {item.message ? `"${item.message}"` : "—"}
                      </span>
                    ),
                  },
                  {
                    header: "Date",
                    accessor: (item) =>
                      new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                  },
                ]}
                onEdit={(item) => {
                  setEditingItem(item);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => handleDelete("rsvp", [id])}
                onBulkDelete={(ids) => handleDelete("rsvp", ids)}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishes & Blessings */}
      {activeTab === "wishes" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
            <div>
              <h3 className="font-serif text-base font-bold italic text-[#231C18]">
                Wishes &amp; Blessings
              </h3>
              <p className="text-xs text-amber-900/60">
                Heartfelt messages and blessings shared by your wedding guests.
              </p>
            </div>
            <a
              href="/api/export-wishes"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
          </div>

          <DataTable
            data={wishes}
            columns={[
              {
                header: "Sender Name",
                accessor: "name",
                className: "font-semibold text-slate-900",
              },
              {
                header: "Blessing / Message",
                accessor: (item) => (
                  <span className="block max-w-[350px] text-slate-600 italic">
                    &ldquo;{item.message}&rdquo;
                  </span>
                ),
              },
              {
                header: "Date",
                accessor: (item) =>
                  new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
              },
            ]}
            onEdit={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
            onDelete={(id) => handleDelete("wish", [id])}
            onBulkDelete={(ids) => handleDelete("wish", ids)}
          />
        </div>
      )}

      {/* Tab 3: Music & Songs */}
      {activeTab === "music" && (
        <div>
          <MusicManager />
        </div>
      )}

      {/* Tab 4: Print & QR Codes (Combined) */}
      {activeTab === "print" && (
        <div className="space-y-4">
          <div className="inline-flex rounded-xl bg-white border border-amber-900/10 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setPrintSubTab("qr")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                printSubTab === "qr"
                  ? "bg-amber-100/70 text-amber-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" /> 📌 Table Stand QR Codes
            </button>
            <button
              type="button"
              onClick={() => setPrintSubTab("pdf")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                printSubTab === "pdf"
                  ? "bg-amber-100/70 text-amber-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Printer className="h-3.5 w-3.5" /> 💌 Printable Invitation Cards (PDF)
            </button>
          </div>

          <div className="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-8 shadow-xs">
            {printSubTab === "qr" ? (
              <QRCodeManager siteUrl={siteUrl} />
            ) : (
              <InvitationManager siteUrl={siteUrl} />
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Wedding Details */}
      {activeTab === "settings" && (
        <div>
          <SettingsTab />
        </div>
      )}

      {/* Edit Entry Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold italic text-slate-900">
                Edit {guestSubTab === "public" ? "RSVP" : "Wish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                handleUpdate(
                  guestSubTab === "public" ? "rsvp" : "wish",
                  editingItem.id,
                  data
                );
              }}
              className="space-y-4"
            >
              {guestSubTab === "public" ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Guest Name
                    </label>
                    <input
                      name="guest_name"
                      defaultValue={editingItem.guest_name}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Attendance
                      </label>
                      <select
                        name="attendance"
                        defaultValue={editingItem.attendance}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      >
                        <option value="hadir">Attending</option>
                        <option value="ragu">Tentative</option>
                        <option value="tidak_hadir">Cannot Attend</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Guests (Pax)
                      </label>
                      <input
                        type="number"
                        name="guest_count"
                        defaultValue={editingItem.guest_count}
                        min={1}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      defaultValue={editingItem.message}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Sender Name
                    </label>
                    <input
                      name="name"
                      defaultValue={editingItem.name}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Blessing / Message
                    </label>
                    <textarea
                      name="message"
                      defaultValue={editingItem.message}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-amber-600"
                      rows={4}
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8C1D24] to-[#750D14] px-5 py-2 text-xs font-bold text-white shadow-md hover:from-[#750D14] hover:to-[#5E0A10] disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
