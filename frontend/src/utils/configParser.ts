import type { AppConfig, CelebrationEvent, StorySlide } from "../types";

export const DEFAULT_CEREMONIES: CelebrationEvent[] = [
  {
    id: 1,
    key: "MEHENDI",
    title: "Mehendi Ceremony",
    subtitle: "Adorning hands with henna, music & sweet celebration",
    dayDate: "Sunday, 14 February 2027",
    time: "04:00 PM onwards",
    venueName: "Royal Courtyard, The Club International",
    venueAddress: "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)",
    dressCode: "Vibrant Mehndi Greens & Pastel Florals",
    desc: "Welcoming our beloved guests as Chandrika adorns bridal henna, accompanied by live folk rhythms, traditional bangles artisan, and gourmet chaat stations.",
    illustration: "🌿",
    startIso: "2027-02-14T16:00:00+05:30",
    endIso: "2027-02-14T20:00:00+05:30",
  },
  {
    id: 2,
    key: "HALDI",
    title: "Haldi Ceremony",
    subtitle: "A splash of sunshine, laughter & turmeric blessings",
    dayDate: "Monday, 15 February 2027",
    time: "10:00 AM onwards",
    venueName: "Poolside Pavilion, The Club International",
    venueAddress: "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)",
    dressCode: "Sunny Yellows, Ochre & Marigold Orange",
    desc: "An auspicious ceremony of turmeric paste blessings for Chandrika & Xudong, accompanied by celebratory dhol beats and a shower of fresh marigold and rose petals.",
    illustration: "🌼",
    startIso: "2027-02-15T10:00:00+05:30",
    endIso: "2027-02-15T13:00:00+05:30",
  },
  {
    id: 3,
    key: "WEDDING",
    title: "Wedding Ceremony (Baraat & Sacred Pheras)",
    subtitle: "The sacred vows of love under the holy mandap",
    dayDate: "Monday, 15 February 2027",
    time: "Baraat: 07:00 PM • Pheras: 08:30 PM",
    venueName: "The Grand Mandap, The Club International",
    venueAddress: "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)",
    dressCode: "Traditional Banarasi Silks & Regal Sherwanis",
    desc: "Xudong arrives with joyful baraat procession, followed by Chandrika's grand bridal entrance and the sacred seven pheras around the holy agni.",
    illustration: "🔥",
    startIso: "2027-02-15T19:00:00+05:30",
    endIso: "2027-02-15T22:00:00+05:30",
  },
];

export const DEFAULT_STORY_SLIDES: StorySlide[] = [
  {
    image: "/couple/snow_winter.jpg",
    chapter: "Chapter 01",
    title: "The Snowy Trails",
    subtitle: "Where our journey began",
    caption:
      "Wrapped in winter warmth, shared laughter, and quiet pine trees that witnessed the start of our story.",
  },
  {
    image: "/couple/tuktuk_candid.jpg",
    chapter: "Chapter 02",
    title: "Joy & Sweet Laughter",
    subtitle: "Finding magic in simple moments",
    caption:
      "From fun rickshaw rides to late-night chats, every ordinary day turned into an extraordinary memory.",
  },
  {
    image: "/couple/travel_fun.jpg",
    chapter: "Chapter 03",
    title: "Adventures Near & Far",
    subtitle: "Exploring the world together",
    caption:
      "Hand in hand through sunny skies and new horizons, discovering that home is wherever we are together.",
  },
  {
    image: "/couple/proposal_story.jpg",
    chapter: "Chapter 04",
    title: "Under Tropical Stars",
    subtitle: "The proposal on the bridge",
    caption:
      "A knee on the wooden bridge, a box opened under the palms, and a question straight from the heart.",
  },
  {
    image: "/couple/ring_reveal.jpg",
    chapter: "Chapter 05",
    title: "She Said YES!",
    subtitle: "A lifetime promise begins",
    caption:
      "With tears of pure happiness, glowing lanterns, and full hearts ready to spend forever as one.",
  },
  {
    image: "/couple/formal_portrait.jpg",
    chapter: "Chapter 06",
    title: "Stepping Into Forever",
    subtitle: "Under the Holy Mandap",
    caption:
      "Chandrika & Xudong warmly welcome you to celebrate their wedding nuptials on February 14 & 15, 2027 in Gurugram.",
  },
];

export function parseConfig(raw: Record<string, string>): AppConfig {
  const parseJson = <T>(str: string | undefined, fallback: T): T => {
    if (!str) return fallback;
    try {
      return JSON.parse(str) as T;
    } catch {
      return fallback;
    }
  };

  const parsedCeremonies = parseJson<CelebrationEvent[]>(raw.CELEBRATIONS, DEFAULT_CEREMONIES);
  const celebrations =
    Array.isArray(parsedCeremonies) && parsedCeremonies.length > 0
      ? parsedCeremonies
      : DEFAULT_CEREMONIES;

  const parsedSlides = parseJson<StorySlide[]>(raw.STORY_SLIDES, DEFAULT_STORY_SLIDES);
  const storySlides =
    Array.isArray(parsedSlides) && parsedSlides.length > 0
      ? parsedSlides
      : DEFAULT_STORY_SLIDES;

  return {
    couple: {
      bride: {
        name: raw.BRIDE_NICKNAME ?? "Bride",
        fullName: raw.BRIDE_FULLNAME ?? "Bride",
        parents: raw.BRIDE_PARENTS ?? "",
        instagram: raw.BRIDE_INSTAGRAM ?? "",
        image: raw.BRIDE_IMAGE ?? "https://placehold.co/600x800",
      },
      groom: {
        name: raw.GROOM_NICKNAME ?? "Groom",
        fullName: raw.GROOM_FULLNAME ?? "Groom",
        parents: raw.GROOM_PARENTS ?? "",
        instagram: raw.GROOM_INSTAGRAM ?? "",
        image: raw.GROOM_IMAGE ?? "https://placehold.co/600x800",
      },
    },
    venue: {
      name: raw.VENUE_NAME ?? "",
      address: raw.VENUE_ADDRESS ?? "",
      latitude: parseFloat(raw.VENUE_LAT ?? "0"),
      longitude: parseFloat(raw.VENUE_LNG ?? "0"),
    },
    events: {
      akad: {
        title: raw.AKAD_TITLE ?? "Akad Nikah",
        day: raw.AKAD_DAY ?? "",
        date: raw.AKAD_DATE ?? "",
        startTime: raw.AKAD_START ?? "",
        endTime: raw.AKAD_END ?? "",
        startDateTime: new Date(
          raw.AKAD_ISO_START ?? "2025-01-01T08:00:00+07:00"
        ),
        endDateTime: new Date(raw.AKAD_ISO_END ?? "2025-01-01T10:00:00+07:00"),
      },
      resepsi: {
        title: raw.RESEPSI_TITLE ?? "Resepsi",
        day: raw.RESEPSI_DAY ?? "",
        date: raw.RESEPSI_DATE ?? "",
        startTime: raw.RESEPSI_START ?? "",
        endTime: raw.RESEPSI_END ?? "",
        startDateTime: new Date(
          raw.RESEPSI_ISO_START ?? "2025-01-01T11:00:00+07:00"
        ),
        endDateTime: new Date(
          raw.RESEPSI_ISO_END ?? "2025-01-01T14:00:00+07:00"
        ),
      },
    },
    hero: {
      image: raw.HERO_IMAGE ?? "",
      city: raw.HERO_CITY ?? "",
    },
    music: {
      url: raw.MUSIC_URL ?? "",
    },
    rsvp: {
      maxGuests: parseInt(raw.RSVP_MAX_GUESTS ?? "10", 10),
    },
    bankAccounts: parseJson(raw.BANK_ACCOUNTS, []),
    loveStory: parseJson(raw.LOVE_STORY, []),
    galleryImages: parseJson(raw.GALLERY_IMAGES, []),
    text: {
      opening: {
        salam: raw.TEXT_SALAM_OPENING ?? "",
      },
      quote: {
        ar_rum: raw.TEXT_QUOTE_AR_RUM ?? "",
        source: raw.TEXT_QUOTE_SOURCE ?? "",
      },
      invitation: raw.TEXT_INVITATION ?? "",
      closing: {
        text: raw.TEXT_CLOSING ?? "",
        salam: raw.TEXT_SALAM_CLOSING ?? "",
        signature: raw.TEXT_SIGNATURE ?? "",
        family: raw.TEXT_FAMILY ?? "",
      },
      gift: {
        title: raw.TEXT_GIFT_TITLE ?? "",
        desc: raw.TEXT_GIFT_DESC ?? "",
      },
    },
    telegram: {
      botToken: raw.TELEGRAM_BOT_TOKEN ?? "",
      chatId: raw.TELEGRAM_CHAT_ID ?? "",
    },
    celebrations,
    storySlides,
  };
}
