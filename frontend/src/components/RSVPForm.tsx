import React, { useState, useEffect } from "react";
import {
  Send,
  CheckCircle2,
  Heart,
  Users,
  Clock,
  RefreshCcw,
  Minus,
  Plus,
} from "lucide-react";
import { dbService } from "../services/dbService";
import { AttendanceStatus, type RSVP, type AppConfig } from "../types";

const RSVPForm: React.FC<{ config: AppConfig }> = ({ config }) => {
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    attendance: AttendanceStatus.HADIR,
    guest_count: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  const maxGuests = config.rsvp.maxGuests;

  const loadRSVPs = async () => {
    const data = await dbService.getRSVPs();
    setRsvps(data);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) {
      setFormData((prev) => ({ ...prev, guest_name: to }));
      setIsNameLocked(true);
    }
    loadRSVPs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest_name) return;
    setIsSubmitting(true);
    try {
      await dbService.saveRSVP(formData);
      setSubmitted(true);
      await loadRSVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestCount = (operation: "inc" | "dec") => {
    setFormData((prev) => {
      const current = prev.guest_count;
      let next = current;
      if (operation === "inc" && current < maxGuests) next = current + 1;
      if (operation === "dec" && current > 1) next = current - 1;
      return { ...prev, guest_count: next };
    });
  };

  const stats = {
    hadir: rsvps
      .filter((r) => r.attendance === AttendanceStatus.HADIR)
      .reduce((total, r) => total + (r.guest_count || 1), 0),
    ragu: rsvps.filter((r) => r.attendance === AttendanceStatus.RAGU).length,
    tidak: rsvps.filter((r) => r.attendance === AttendanceStatus.TIDAK_HADIR)
      .length,
  };

  const getStatusLabel = (status: AttendanceStatus | string) => {
    switch (status) {
      case AttendanceStatus.HADIR:
      case "hadir":
        return "Attending";
      case AttendanceStatus.TIDAK_HADIR:
      case "tidak_hadir":
        return "Unable to Attend";
      case AttendanceStatus.RAGU:
      case "ragu":
        return "Tentative";
      default:
        return String(status);
    }
  };

  const getStatusColor = (status: AttendanceStatus | string) => {
    switch (status) {
      case AttendanceStatus.HADIR:
      case "hadir":
        return "text-green-600 dark:text-green-400";
      case AttendanceStatus.TIDAK_HADIR:
      case "tidak_hadir":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  return (
    <section
      id="rsvp"
      className="dark:bg-darkBg bg-[#FAF5EB] py-16 transition-colors duration-1000 md:py-36 border-t border-[#D4AF37]/20"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 space-y-3 text-center md:mb-20">
          <Heart className="text-[#8C1D24] dark:text-accent mx-auto mb-2 h-5 w-5 animate-pulse" />
          <h2 className="font-serif text-4xl tracking-tight text-[#231C18] italic md:text-8xl dark:text-white">
            RSVP
          </h2>
          <p className="tracking-luxury text-[9px] font-bold text-[#8C6B1C] uppercase md:text-[11px] dark:text-slate-400">
            Kindly confirm your auspicious presence
          </p>
        </div>

        <div className="grid items-stretch gap-8 md:gap-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="editorial-card group relative flex h-full flex-col justify-center overflow-hidden rounded-[1.5rem] p-6 shadow-lg md:rounded-[3.5rem] md:p-14">
              {submitted ? (
                <div className="animate-reveal space-y-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-slate-900 italic md:text-4xl dark:text-white">
                      Thank You!
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 md:text-base dark:text-slate-400">
                      Your RSVP confirmation has been received with gratitude.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Update Response
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-accentDark/5 dark:bg-accent/5 pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full transition-transform duration-1000 group-hover:scale-110"></div>
                  <div className="relative z-10 space-y-8 md:space-y-12">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-10 dark:border-white/5">
                      <div className="text-accentDark dark:text-accent flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 md:h-16 md:w-16 md:rounded-2xl dark:border-white/10 dark:bg-white/5">
                        <Users className="h-5 w-5 md:h-8 md:w-8" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg leading-none text-slate-900 italic md:text-2xl dark:text-white">
                          Confirmation
                        </h3>
                        <p className="tracking-editorial mt-1.5 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                          Please fill in your details
                        </p>
                      </div>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6 md:space-y-10"
                    >
                      <div className="space-y-6 md:space-y-8">
                        <div className="group/input relative">
                          <input
                            required
                            type="text"
                            disabled={isNameLocked}
                            className={`focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-200 md:py-5 md:text-xl dark:border-white/10 dark:text-white ${
                              isNameLocked
                                ? "cursor-not-allowed text-slate-500 opacity-60"
                                : ""
                            }`}
                            placeholder="Your Full Name"
                            value={formData.guest_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                guest_name: e.target.value,
                              })
                            }
                          />
                          <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                            Full Name {isNameLocked && "(Locked)"}
                          </label>
                        </div>
                        <div className="group/input relative">
                          <input
                            type="text"
                            className="focus:border-accentDark dark:focus:border-accent w-full border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-400 md:py-5 md:text-xl dark:border-white/10 dark:text-white"
                            placeholder="Phone / WhatsApp Number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                          <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                            Contact Number
                          </label>
                        </div>
                      </div>
                      <div className="group/input relative mt-8">
                        <textarea
                          className="focus:border-accentDark dark:focus:border-accent w-full resize-none border-b border-slate-200 bg-transparent py-2 font-serif text-base text-slate-900 italic transition-all outline-none placeholder:text-slate-400 md:py-5 md:text-xl dark:border-white/10 dark:text-white"
                          placeholder="Warm message for Chandrika & Xudong (Optional)"
                          rows={2}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                        />
                        <label className="tracking-editorial group-focus-within/input:text-accentDark absolute -top-3.5 left-0 text-[7px] font-bold text-slate-400 uppercase transition-colors md:text-[9px]">
                          Message
                        </label>
                      </div>
                      <div className="space-y-3 md:space-y-6">
                        <p className="tracking-editorial mb-1 text-[8px] font-bold text-slate-400 uppercase md:text-[9px]">
                          Will You Attend?
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            AttendanceStatus.HADIR,
                            AttendanceStatus.TIDAK_HADIR,
                            AttendanceStatus.RAGU,
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, attendance: status })
                              }
                              className={`tracking-editorial group flex items-center justify-between rounded-lg border px-5 py-3.5 text-[9px] font-bold uppercase transition-all md:rounded-2xl md:py-5 md:text-[11px] cursor-pointer ${
                                formData.attendance === status
                                  ? "bg-gradient-to-r from-[#8C1D24] to-[#B71C1C] border-[#8C1D24] text-white shadow-md dark:border-accent dark:bg-accent"
                                  : "border-[#D4AF37]/30 text-[#5A4D43] bg-[#FAF5EB] hover:bg-[#F3E7D5] dark:border-white/5 dark:hover:bg-white/5"
                              }`}
                            >
                              {getStatusLabel(status)}
                              {formData.attendance === status && (
                                <CheckCircle2 className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#FFE082]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.attendance === AttendanceStatus.HADIR && (
                        <div className="animate-reveal space-y-3">
                          <p className="tracking-editorial mb-1 text-[8px] font-bold text-[#8C6B1C] uppercase md:text-[9px]">
                            Number of Guests (Max {maxGuests})
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => handleGuestCount("dec")}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#FAF5EB] text-[#231C18] transition-colors hover:bg-[#F0E3CF] disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer"
                              disabled={formData.guest_count <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="flex-1 border-b border-[#D4AF37]/30 pb-1 text-center font-serif text-xl italic text-[#231C18] md:text-2xl dark:border-white/5">
                              {formData.guest_count} {formData.guest_count === 1 ? "Guest" : "Guests"}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGuestCount("inc")}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#FAF5EB] text-[#231C18] transition-colors hover:bg-[#F0E3CF] disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer"
                              disabled={formData.guest_count >= maxGuests}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="bg-gradient-to-r from-[#8C1D24] via-[#A8232B] to-[#750D14] hover:from-[#750D14] hover:to-[#8C1D24] tracking-luxury group flex w-full items-center justify-center gap-3 rounded-xl py-3.5 text-[9px] font-bold text-white uppercase shadow-md transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-50 md:rounded-3xl md:py-6 md:text-[11px] cursor-pointer"
                      >
                        {isSubmitting
                          ? "Sending..."
                          : isNameLocked
                            ? "Update RSVP"
                            : "Confirm RSVP"}
                        <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-5 md:w-5 text-[#FFE082]" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {[
                {
                  label: "Attending",
                  count: stats.hadir,
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  label: "Tentative",
                  count: stats.ragu,
                  color: "text-slate-500 dark:text-slate-400",
                },
                {
                  label: "Declined",
                  count: stats.tidak,
                  color: "text-red-500 dark:text-red-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="editorial-card flex flex-col items-center justify-center space-y-2 rounded-[1.5rem] border border-slate-100 p-4 text-center md:rounded-[2.5rem] md:p-8 dark:border-white/5"
                >
                  <span
                    className={`font-serif text-2xl font-bold md:text-5xl ${item.color}`}
                  >
                    {item.count}
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-60 md:text-[10px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="editorial-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 p-6 shadow-lg md:rounded-[4rem] md:p-14 dark:border-white/5">
              <div className="from-accent/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50"></div>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-8 flex flex-shrink-0 items-center justify-between">
                  <h3 className="font-serif text-xl text-slate-900 italic md:text-3xl dark:text-white">
                    Guest List
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-50">
                    <Clock className="h-3 w-3" />
                    <span>Recent</span>
                  </div>
                </div>
                <div className="custom-scrollbar -mr-2 h-96 flex-grow overflow-y-auto pr-2 md:h-[450px]">
                  {rsvps.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center opacity-40">
                      <Users className="mb-2 h-8 w-8" />
                      <span className="text-xs tracking-widest uppercase">
                        No RSVPs yet
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {rsvps.map((rsvp) => (
                        <div
                          key={rsvp.id}
                          className="editorial-card animate-reveal space-y-4 rounded-2xl p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                {rsvp.guest_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate font-serif text-base text-slate-800 italic dark:text-slate-200">
                                {rsvp.guest_name}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold uppercase ${getStatusColor(
                                rsvp.attendance
                              )}`}
                            >
                              {getStatusLabel(rsvp.attendance)}
                            </span>
                          </div>
                          {rsvp.attendance === AttendanceStatus.HADIR && (
                            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/5 dark:text-slate-500">
                              <Users className="h-4 w-4" />
                              <span>{(rsvp.guest_count || 1)} {(rsvp.guest_count || 1) === 1 ? "guest" : "guests"} attending</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RSVPForm;
