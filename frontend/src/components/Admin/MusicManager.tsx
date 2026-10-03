import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Disc,
  Edit2,
  FileAudio,
  ImageIcon,
  Loader2,
  Music,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import { invalidateConfigCache } from "../../hooks/useConfig";
import type { TrackItem } from "../../types";
import { DEFAULT_PLAYLIST_TRACKS } from "../../utils/configParser";

const COLOR_PRESETS = [
  { name: "Royal Gold", hex: "#D4AF37" },
  { name: "Bridal Red", hex: "#8C1D24" },
  { name: "Rose Ruby", hex: "#E11D48" },
  { name: "Amber Ochre", hex: "#D9822B" },
  { name: "Cerulean Blue", hex: "#3B82F6" },
  { name: "Emerald Pine", hex: "#10B981" },
  { name: "Champagne", hex: "#B38E38" },
  { name: "Midnight Navy", hex: "#1E293B" },
];

const EXISTING_COUPLE_PHOTOS = [
  { label: "Formal Portrait", path: "/couple/formal_portrait.jpg" },
  { label: "The Proposal", path: "/couple/proposal_story.jpg" },
  { label: "Ring Reveal", path: "/couple/ring_reveal.jpg" },
  { label: "Travel Memories", path: "/couple/travel_fun.jpg" },
  { label: "Winter Trails", path: "/couple/snow_winter.jpg" },
  { label: "TukTuk Candid", path: "/couple/tuktuk_candid.jpg" },
];

export const MusicManager: React.FC = () => {
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [bgMusicUrl, setBgMusicUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Per-track action loading state
  const [actionLoadingTrackId, setActionLoadingTrackId] = useState<string | null>(null);
  const [isUploadingBgMusic, setIsUploadingBgMusic] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrackItem | null>(null);

  // New song form state
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newTag, setNewTag] = useState("Celebration");
  const [newColor, setNewColor] = useState("#D4AF37");
  const [newSrc, setNewSrc] = useState("");
  const [newPoster, setNewPoster] = useState("/couple/formal_portrait.jpg");
  const [isUploadingNewAudio, setIsUploadingNewAudio] = useState(false);
  const [isUploadingNewPoster, setIsUploadingNewPoster] = useState(false);

  // File input refs for quick replacements
  const replaceAudioInputRef = useRef<HTMLInputElement>(null);
  const replacePosterInputRef = useRef<HTMLInputElement>(null);
  const activeReplaceTrackId = useRef<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/config/full", { credentials: "include" });
      const raw = res.ok ? await res.json() : {};

      if (raw.PLAYLIST_TRACKS) {
        try {
          const parsed = JSON.parse(raw.PLAYLIST_TRACKS);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTracks(parsed);
          } else {
            setTracks(DEFAULT_PLAYLIST_TRACKS);
          }
        } catch {
          setTracks(DEFAULT_PLAYLIST_TRACKS);
        }
      } else {
        setTracks(DEFAULT_PLAYLIST_TRACKS);
      }

      setBgMusicUrl(raw.MUSIC_URL || "https://www.bensound.com/bensound-music/bensound-forever.mp3");
    } catch (e) {
      console.error(e);
      setTracks(DEFAULT_PLAYLIST_TRACKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const persistChanges = async (
    updatedTracks: TrackItem[],
    updatedBgMusic?: string,
    successMsg = "Changes saved successfully!"
  ) => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        PLAYLIST_TRACKS: JSON.stringify(updatedTracks),
      };
      if (updatedBgMusic !== undefined) {
        payload.MUSIC_URL = updatedBgMusic;
      }

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTracks(updatedTracks);
        if (updatedBgMusic !== undefined) setBgMusicUrl(updatedBgMusic);
        invalidateConfigCache();
        showToast(successMsg, "success");
      } else {
        showToast("Failed to save changes to server.", "error");
      }
    } catch {
      showToast("Network error while saving changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Upload an audio file to backend
  const uploadAudioFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/audio", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to upload MP3 file");
    }

    const data = await res.json();
    return data.url;
  };

  // Upload an image file to backend
  const uploadImageFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to upload image file");
    }

    const data = await res.json();
    return data.url;
  };

  // Delete a song from playlist
  const handleDeleteSong = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the wedding playlist?`)) {
      return;
    }
    const updated = tracks.filter((t) => t.id !== id);
    persistChanges(updated, undefined, `Deleted "${title}" from playlist`);
  };

  // Quick Replace Audio on existing song card
  const handleTriggerReplaceAudio = (trackId: string) => {
    activeReplaceTrackId.current = trackId;
    replaceAudioInputRef.current?.click();
  };

  const handleAudioFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const trackId = activeReplaceTrackId.current;
    if (!file || !trackId) return;

    try {
      setActionLoadingTrackId(trackId);
      const url = await uploadAudioFile(file);
      if (url) {
        const updated = tracks.map((t) => (t.id === trackId ? { ...t, src: url } : t));
        await persistChanges(updated, undefined, `Updated MP3 audio for track!`);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload audio", "error");
    } finally {
      setActionLoadingTrackId(null);
      if (replaceAudioInputRef.current) replaceAudioInputRef.current.value = "";
    }
  };

  // Quick Replace Image on existing song card
  const handleTriggerReplacePoster = (trackId: string) => {
    activeReplaceTrackId.current = trackId;
    replacePosterInputRef.current?.click();
  };

  const handlePosterFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const trackId = activeReplaceTrackId.current;
    if (!file || !trackId) return;

    try {
      setActionLoadingTrackId(trackId);
      const url = await uploadImageFile(file);
      if (url) {
        const updated = tracks.map((t) => (t.id === trackId ? { ...t, poster: url } : t));
        await persistChanges(updated, undefined, `Updated music card artwork image!`);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setActionLoadingTrackId(null);
      if (replacePosterInputRef.current) replacePosterInputRef.current.value = "";
    }
  };

  // Delete/Reset Image on an existing song
  const handleDeleteImage = (trackId: string) => {
    const fallbackImage = "/couple/formal_portrait.jpg";
    const updated = tracks.map((t) => (t.id === trackId ? { ...t, poster: fallbackImage } : t));
    persistChanges(updated, undefined, "Artwork reset to default wedding photo.");
  };

  // Add new song submit
  const handleAddNewSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Please provide a song title", "error");
      return;
    }
    if (!newSrc.trim()) {
      showToast("Please upload an MP3 audio file or enter an audio URL", "error");
      return;
    }

    const newTrack: TrackItem = {
      id: `track-${Date.now()}`,
      title: newTitle.trim(),
      shortLabel: `${newTitle.trim()} • ${newTag.trim() || "Wedding"}`,
      artist: newArtist.trim() || "Wedding Celebration",
      tag: newTag.trim() || "Celebration",
      mainColor: newColor,
      src: newSrc.trim(),
      poster: newPoster.trim() || "/couple/formal_portrait.jpg",
    };

    const updated = [...tracks, newTrack];
    await persistChanges(updated, undefined, `Added "${newTrack.title}" to playlist!`);

    // Reset and close
    setNewTitle("");
    setNewArtist("");
    setNewTag("Celebration");
    setNewColor("#D4AF37");
    setNewSrc("");
    setNewPoster("/couple/formal_portrait.jpg");
    setIsAddModalOpen(false);
  };

  // Save edit track modal
  const handleSaveEditTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;

    const updated = tracks.map((t) => (t.id === editingTrack.id ? editingTrack : t));
    await persistChanges(updated, undefined, `Updated "${editingTrack.title}"`);
    setEditingTrack(null);
  };

  // Background envelope music update
  const handleBgMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBgMusic(true);
      const url = await uploadAudioFile(file);
      if (url) {
        await persistChanges(tracks, url, "Updated envelope background music!");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload background audio", "error");
    } finally {
      setIsUploadingBgMusic(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-sm font-medium text-slate-500">Loading music playlist &amp; songs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl transition-all duration-300 animate-slide-up ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Hidden file inputs for quick on-card replacements */}
      <input
        type="file"
        ref={replaceAudioInputRef}
        onChange={handleAudioFileSelected}
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
        className="hidden"
      />
      <input
        type="file"
        ref={replacePosterInputRef}
        onChange={handlePosterFileSelected}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Disc className="h-4 w-4" />
            </span>
            <h2 className="font-serif text-2xl font-bold italic text-slate-900 dark:text-white">
              Music &amp; Song Manager
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add or delete songs by uploading MP3 files. Customize or delete cover photos for the 2026 Music Card &amp; Wheel Carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-600/20 transition-all hover:from-amber-700 hover:to-amber-800"
          >
            <Plus className="h-4 w-4" /> Add New Song
          </button>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold italic text-slate-800 dark:text-white flex items-center gap-2">
            <Music className="h-4 w-4 text-amber-600" /> Current Celebration Playlist ({tracks.length} Songs)
          </h3>
          <span className="text-xs text-slate-400">
            Drag wheel or tap list on main site to play
          </span>
        </div>

        {tracks.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-700">
            <FileAudio className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h4 className="mt-3 font-serif text-base font-bold text-slate-700 dark:text-slate-300">
              No songs in playlist
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Click &quot;Add New Song&quot; above to upload your first MP3 and wedding photo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tracks.map((track, idx) => {
              const isActionLoading = actionLoadingTrackId === track.id;
              return (
                <div
                  key={track.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* Top Bar: Number badge & Color accent */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <span
                        className="h-3 w-3 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: track.mainColor }}
                        title={`Color: ${track.mainColor}`}
                      />
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {track.tag || "Song"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTrack({ ...track })}
                        title="Edit Song Details"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSong(track.id, track.title)}
                        title="Delete Song from Playlist"
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Artwork Poster Section */}
                  <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                    <img
                      src={track.poster}
                      alt={track.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/couple/formal_portrait.jpg";
                      }}
                    />

                    {/* Gradient Overlay with Image Management Buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity">
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTriggerReplacePoster(track.id)}
                          disabled={isActionLoading}
                          className="flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white shadow hover:bg-amber-600 transition"
                          title="Upload new image for music card"
                        >
                          <Upload className="h-3 w-3" /> Change Photo
                        </button>
                        {track.poster !== "/couple/formal_portrait.jpg" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(track.id)}
                            className="flex items-center rounded-lg bg-red-600/80 backdrop-blur-md p-1 text-[10px] text-white hover:bg-red-700"
                            title="Reset / Delete Custom Artwork"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="truncate font-serif text-sm font-bold">{track.title}</p>
                        <p className="truncate text-[11px] text-white/70">{track.artist}</p>
                      </div>
                    </div>

                    {isActionLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  {/* Audio Player & MP3 Management */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-mono truncate max-w-[180px]">
                        <Volume2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        {track.src.startsWith("/uploads/") ? "Uploaded MP3" : "External Audio"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTriggerReplaceAudio(track.id)}
                        disabled={isActionLoading}
                        className="text-[10px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Upload / Replace MP3
                      </button>
                    </div>

                    {/* Native Audio Control for Live Preview in Admin */}
                    <audio
                      controls
                      src={track.src}
                      preload="none"
                      className="h-8 w-full rounded-md accent-amber-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Background Music Card (Envelope Opening) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold italic text-slate-900 dark:text-white">
                Envelope Opening Background Music
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              The gentle romantic soundtrack that plays automatically when guests open their personalized invitation envelope.
            </p>
          </div>

          <label className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-slate-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700">
            {isUploadingBgMusic ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload Background MP3
            <input
              type="file"
              onChange={handleBgMusicUpload}
              accept="audio/*,.mp3,.wav,.m4a"
              className="hidden"
              disabled={isUploadingBgMusic}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={bgMusicUrl}
            onChange={(e) => setBgMusicUrl(e.target.value)}
            placeholder="Audio URL or /uploads/audio/..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => persistChanges(tracks, bgMusicUrl, "Background music URL updated!")}
            disabled={saving}
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition"
          >
            Save URL
          </button>
        </div>

        {bgMusicUrl && (
          <div className="mt-3">
            <audio controls src={bgMusicUrl} preload="none" className="h-8 w-full accent-amber-600" />
          </div>
        )}
      </div>

      {/* Modal 1: Add New Song */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Disc className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold italic text-slate-900 dark:text-white">
                  Add New Song to Playlist
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSong} className="space-y-4">
              {/* Title & Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Kudmayi / Kesariya"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Artist / Musicians
                  </label>
                  <input
                    type="text"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="e.g. Arijit Singh • Sitar Melody"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Tag & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Tag / Ceremony Vibe
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. Royal Symphony, Bridal Walk"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5"
                    />
                    <div className="flex flex-wrap gap-1">
                      {COLOR_PRESETS.slice(0, 5).map((cp) => (
                        <button
                          key={cp.hex}
                          type="button"
                          onClick={() => setNewColor(cp.hex)}
                          className="h-6 w-6 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: cp.hex }}
                          title={cp.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MP3 Audio Upload */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <FileAudio className="h-4 w-4 text-amber-600" /> MP3 Audio File *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 cursor-pointer">
                    {isUploadingNewAudio ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload MP3 File
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      disabled={isUploadingNewAudio}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingNewAudio(true);
                          const url = await uploadAudioFile(file);
                          if (url) setNewSrc(url);
                        } catch (err: any) {
                          showToast(err.message || "Failed to upload audio", "error");
                        } finally {
                          setIsUploadingNewAudio(false);
                        }
                      }}
                    />
                  </label>

                  <span className="text-xs text-slate-400">or enter audio URL:</span>

                  <input
                    type="text"
                    value={newSrc}
                    onChange={(e) => setNewSrc(e.target.value)}
                    placeholder="https://.../song.mp3 or /uploads/audio/..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {newSrc && (
                  <div className="mt-3">
                    <p className="text-[10px] text-emerald-600 font-bold mb-1">Audio Ready for Preview:</p>
                    <audio controls src={newSrc} className="h-7 w-full accent-amber-600" />
                  </div>
                )}
              </div>

              {/* Poster Image Upload */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-amber-600" /> Music Card Cover Image
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-900 cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600">
                    {isUploadingNewPoster ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload Image
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      disabled={isUploadingNewPoster}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingNewPoster(true);
                          const url = await uploadImageFile(file);
                          if (url) setNewPoster(url);
                        } catch (err: any) {
                          showToast(err.message || "Failed to upload image", "error");
                        } finally {
                          setIsUploadingNewPoster(false);
                        }
                      }}
                    />
                  </label>

                  <span className="text-xs text-slate-400">or enter image path:</span>

                  <input
                    type="text"
                    value={newPoster}
                    onChange={(e) => setNewPoster(e.target.value)}
                    placeholder="/couple/formal_portrait.jpg"
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Quick picker from existing couple photos */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Quick Pick From Wedding Gallery:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {EXISTING_COUPLE_PHOTOS.map((photo) => (
                      <button
                        type="button"
                        key={photo.path}
                        onClick={() => setNewPoster(photo.path)}
                        className={`group relative shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 transition ${
                          newPoster === photo.path ? "border-amber-600 ring-2 ring-amber-500/30" : "border-slate-200 hover:border-slate-400"
                        }`}
                        title={photo.label}
                      >
                        <img src={photo.path} alt={photo.label} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {newPoster && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={newPoster}
                      alt="Cover preview"
                      className="h-14 w-14 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/couple/formal_portrait.jpg";
                      }}
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-300">Image Selected</p>
                      <p className="font-mono text-[10px] text-slate-400 truncate max-w-[280px]">{newPoster}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newTitle.trim() || !newSrc.trim()}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Save &amp; Add Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Existing Track Details */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h3 className="font-serif text-lg font-bold italic text-slate-900 dark:text-white">
                Edit Song Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingTrack(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTrack} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  value={editingTrack.artist}
                  onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Tag / Vibe
                  </label>
                  <input
                    type="text"
                    value={editingTrack.tag}
                    onChange={(e) => setEditingTrack({ ...editingTrack, tag: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingTrack.mainColor}
                      onChange={(e) => setEditingTrack({ ...editingTrack, mainColor: e.target.value })}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={editingTrack.mainColor}
                      onChange={(e) => setEditingTrack({ ...editingTrack, mainColor: e.target.value })}
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Audio URL / File Path
                </label>
                <input
                  type="text"
                  value={editingTrack.src}
                  onChange={(e) => setEditingTrack({ ...editingTrack, src: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Cover Photo Path
                </label>
                <input
                  type="text"
                  value={editingTrack.poster}
                  onChange={(e) => setEditingTrack({ ...editingTrack, poster: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-amber-700 disabled:opacity-50"
                >
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

export default MusicManager;
