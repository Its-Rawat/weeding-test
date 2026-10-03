export enum AttendanceStatus {
  HADIR = "hadir",
  TIDAK_HADIR = "tidak_hadir",
  RAGU = "ragu",
}

export interface RSVP {
  id: number;
  guest_name: string;
  email?: string;
  phone?: string;
  attendance: AttendanceStatus;
  guest_count: number;
  message?: string;
  created_at: string;
}

export interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface AppConfig {
  couple: {
    bride: {
      name: string;
      fullName: string;
      parents: string;
      instagram: string;
      image: string;
    };
    groom: {
      name: string;
      fullName: string;
      parents: string;
      instagram: string;
      image: string;
    };
  };
  venue: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  events: {
    akad: WeddingEvent;
    resepsi: WeddingEvent;
  };
  hero: {
    image: string;
    city: string;
  };
  music: {
    url: string;
  };
  rsvp: {
    maxGuests: number;
  };
  bankAccounts: { bank: string; number: string; name: string }[];
  loveStory: { date: string; title: string; desc: string }[];
  galleryImages: string[];
  text: {
    opening: { salam: string };
    quote: { ar_rum: string; source: string };
    invitation: string;
    closing: {
      text: string;
      salam: string;
      signature: string;
      family: string;
    };
    gift: { title: string; desc: string };
  };
  telegram: {
    botToken: string;
    chatId: string;
  };
  celebrations: CelebrationEvent[];
  storySlides: StorySlide[];
  playlistTracks?: TrackItem[];
}

export interface TrackItem {
  id: string;
  title: string;
  shortLabel: string;
  artist: string;
  poster: string;
  src: string;
  mainColor: string;
  tag: string;
}

export interface CelebrationEvent {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  dayDate: string;
  time: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  desc: string;
  illustration: string;
  startIso: string;
  endIso: string;
}

export interface StorySlide {
  image: string;
  chapter: string;
  title: string;
  subtitle: string;
  caption: string;
}

export interface WeddingEvent {
  title: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  startDateTime: Date;
  endDateTime: Date;
}

export type WeddingConfig = AppConfig;
