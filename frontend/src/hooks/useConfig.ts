import { useEffect, useState } from "react";
import type { AppConfig } from "../types";
import { parseConfig } from "../utils/configParser";

const DEFAULT_RAW: Record<string, string> = {
  BRIDE_NICKNAME: "Chandrika",
  GROOM_NICKNAME: "Xudong",
  BRIDE_FULLNAME: "Chandrika Rawat",
  GROOM_FULLNAME: "Xudong",
  BRIDE_PARENTS: "Beloved daughter of Mr. & Mrs. Rawat",
  GROOM_PARENTS: "Beloved son of Mr. & Mrs. Wang",
  BRIDE_INSTAGRAM: "",
  GROOM_INSTAGRAM: "",
  BRIDE_IMAGE: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  GROOM_IMAGE: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  VENUE_NAME: "The Club International",
  VENUE_ADDRESS: "The Club, International City, Sector 109, B3 Ln, Babupur Village, Palam Vihar, Gurgaon, Haryana 122017",
  VENUE_LAT: "28.5134",
  VENUE_LNG: "77.0275",
  AKAD_TITLE: "Wedding Ceremony (Baraat & Pheras)",
  AKAD_DAY: "Sunday",
  AKAD_DATE: "15 February 2027",
  AKAD_START: "19:00",
  AKAD_END: "22:00",
  AKAD_ISO_START: "2027-02-15T19:00:00+05:30",
  AKAD_ISO_END: "2027-02-15T22:00:00+05:30",
  RESEPSI_TITLE: "Royal Reception & Dinner Banquet",
  RESEPSI_DAY: "Sunday",
  RESEPSI_DATE: "15 February 2027",
  RESEPSI_START: "21:30",
  RESEPSI_END: "23:59",
  RESEPSI_ISO_START: "2027-02-15T21:30:00+05:30",
  RESEPSI_ISO_END: "2027-02-15T23:59:00+05:30",
  HERO_IMAGE: "",
  HERO_CITY: "Sector 109, Palam Vihar, Gurgaon",
  MUSIC_URL: "",
  RSVP_MAX_GUESTS: "10",
  BANK_ACCOUNTS: "[]",
  LOVE_STORY: "[]",
  GALLERY_IMAGES: "[]",
  TEXT_SALAM_OPENING: "Together with our families, we cordially invite you",
  TEXT_QUOTE_AR_RUM: "\"Two souls with but a single thought, two hearts that beat as one. In love, kindness, and devotion, we begin our new journey together.\"",
  TEXT_QUOTE_SOURCE: "A Celebration of Love & Unity",
  TEXT_INVITATION: "With immense joy and grateful hearts, we invite you to share in our happiness as we unite in marriage under the holy mandap.",
  TEXT_CLOSING: "Your blessings, presence, and prayers mean everything to us as we begin this beautiful chapter of our lives.",
  TEXT_SALAM_CLOSING: "With warm regards and heartfelt gratitude,",
  TEXT_SIGNATURE: "With Love & Gratitude,",
  TEXT_FAMILY: "Warmly Hosted by Aditya Rawat & Family",
  TEXT_GIFT_TITLE: "",
  TEXT_GIFT_DESC: "",
};

let cache: { data: AppConfig; raw: Record<string, string> } | null = null;

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(
    cache ? cache.data : null
  );
  const [raw, setRaw] = useState<Record<string, string>>(
    cache ? cache.raw : DEFAULT_RAW
  );
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const parsed = parseConfig(data);
        cache = { data: parsed, raw: data };
        setConfig(parsed);
        setRaw(data);
        setLoading(false);
      })
      .catch(() => {
        const fallback = parseConfig(DEFAULT_RAW);
        setConfig(fallback);
        setLoading(false);
      });
  }, []);

  return { config, raw, loading };
}

export function invalidateConfigCache() {
  cache = null;
}
