import { Store, DayKey } from "./types";

export const DAY_ORDER: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_LABEL: Record<DayKey, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

// Real, verified stores with published per-day opening hours.
// Greek stores + official Games Workshop / Warhammer stores abroad.
export const STORES: Store[] = [
  // ─── Greece · Athens ───
  {
    id: 1, name: "Mini Vault", city: "Athens", country: "Greece", postal: "122 42",
    address: "Miriofitou 62-64, Egaleo", lat: 37.9908, lng: 23.6842,
    phone: "+30 21 0590 0162", website: "https://www.minivault.gr",
    hours: { Mon: "08:30–15:30", Tue: "08:30–17:00", Wed: "08:30–17:00", Thu: "08:30–17:00", Fri: "08:30–17:00", Sat: "Closed", Sun: "Closed" },
    verified: true, color: "#8B7CFF",
  },
  {
    id: 2, name: "Kaissa Athens (Exarcheia)", city: "Athens", country: "Greece", postal: "106 83",
    address: "Kallidromiou 8 & Ippokratous, Exarcheia", lat: 37.985005, lng: 23.739638,
    phone: "+30 210 360 6488", website: "https://kaissagames.com",
    hours: { Mon: "10:00–16:00", Tue: "10:00–21:00", Wed: "10:00–16:00", Thu: "10:00–21:00", Fri: "10:00–21:00", Sat: "10:00–16:30", Sun: "Closed" },
    verified: true, color: "#F97316",
  },
  {
    id: 3, name: "Kaissa Halandri", city: "Halandri", country: "Greece", postal: "152 34",
    address: "Chaimanta & Aristotelous 33", lat: 38.020930, lng: 23.802803,
    phone: "+30 210 689 8485", website: "https://kaissagames.com",
    hours: { Mon: "10:30–15:30", Tue: "10:30–21:00", Wed: "10:30–15:30", Thu: "10:30–21:00", Fri: "10:30–21:00", Sat: "10:30–15:00", Sun: "Closed" },
    verified: true, color: "#F97316",
  },
  {
    id: 4, name: "Kaissa Glyfada", city: "Glyfada", country: "Greece", postal: "166 74",
    address: "Chorikon 4", lat: 37.864704, lng: 23.747357,
    phone: "+30 210 898 2057", website: "https://kaissagames.com",
    hours: { Mon: "10:30–15:30", Tue: "10:30–20:30", Wed: "10:30–15:30", Thu: "10:30–20:30", Fri: "10:30–20:30", Sat: "10:30–15:30", Sun: "Closed" },
    verified: true, color: "#F97316",
  },
  {
    id: 5, name: "Kaissa Peristeri", city: "Peristeri", country: "Greece", postal: "121 34",
    address: "Ethnikis Antistaseos 85A", lat: 38.014040, lng: 23.688551,
    phone: "+30 210 572 2291", website: "https://kaissagames.com",
    hours: { Mon: "10:30–15:30", Tue: "10:30–20:30", Wed: "10:30–15:30", Thu: "10:30–20:30", Fri: "10:30–20:30", Sat: "10:30–15:30", Sun: "Closed" },
    verified: true, color: "#F97316",
  },
  {
    id: 6, name: "Kaissa Maroussi", city: "Maroussi", country: "Greece", postal: "151 22",
    address: "Kondyli 7", lat: 38.0512, lng: 23.8050,
    phone: "+30 210 614 1675", website: "https://www.kaissa.eu",
    hours: { Mon: "09:30–21:00", Tue: "09:30–21:00", Wed: "09:30–21:00", Thu: "09:30–22:00", Fri: "09:30–22:00", Sat: "09:30–20:00", Sun: "Closed" },
    verified: true, color: "#F97316",
  },
  {
    id: 7, name: "Fantasy Shop (Victoria)", city: "Athens", country: "Greece", postal: "104 33",
    address: "3is Septemvriou 65, Victoria", lat: 37.997769, lng: 23.731404,
    phone: "+30 210 823 1072", website: "https://www.fantasy-shop.gr",
    hours: { Mon: "10:00–18:00", Tue: "10:00–20:00", Wed: "10:00–18:00", Thu: "10:00–20:00", Fri: "10:00–20:00", Sat: "10:00–18:00", Sun: "Closed" },
    verified: true, color: "#22C55E",
  },

  // ─── United Kingdom ───
  {
    id: 8, name: "Warhammer World", city: "Nottingham", country: "United Kingdom", postal: "NG7 2WS",
    address: "Willow Road, Lenton", lat: 52.94125, lng: -1.17351,
    phone: "+44 115 900 4151", website: "https://warhammerworld.warhammer-community.com",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "10:00–22:00", Fri: "10:00–22:00", Sat: "10:00–20:00", Sun: "10:00–18:00" },
    verified: true, color: "#F5C542",
  },
  {
    id: 9, name: "Warhammer – Tottenham Court Road", city: "London", country: "United Kingdom", postal: "W1T 7QW",
    address: "243 Tottenham Court Road", lat: 51.518289, lng: -0.131657,
    phone: "+44 20 7323 6408", website: "https://www.games-workshop.com",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "10:00–18:00", Fri: "10:00–18:00", Sat: "10:00–18:00", Sun: "11:00–18:00" },
    verified: true, color: "#F5C542",
  },
  {
    id: 10, name: "Dark Sphere", city: "London", country: "United Kingdom", postal: "SE1 7LD",
    address: "186 Hercules Road, Waterloo", lat: 51.496259, lng: -0.115150,
    phone: "+44 20 7928 1373", website: "https://www.darksphere.co.uk",
    hours: { Mon: "15:00–23:00", Tue: "15:00–23:00", Wed: "12:00–23:00", Thu: "15:00–23:00", Fri: "15:00–23:00", Sat: "11:00–20:00", Sun: "12:00–17:00" },
    verified: true, color: "#22D3EE",
  },

  // ─── Germany ───
  {
    id: 11, name: "Warhammer – Berlin (Europa Center)", city: "Berlin", country: "Germany", postal: "10789",
    address: "Tauentzienstraße 9-12, Europa Center", lat: 52.504478, lng: 13.337588,
    phone: "+49 30 25757440", website: "https://www.games-workshop.com",
    hours: { Mon: "11:00–19:00", Tue: "11:00–19:00", Wed: "14:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "11:00–19:00", Sun: "Closed" },
    verified: true, color: "#F5C542",
  },
  {
    id: 12, name: "Warhammer – Berlin (Alexanderplatz)", city: "Berlin", country: "Germany", postal: "10178",
    address: "Litfaß-Platz 3", lat: 52.5219806, lng: 13.4031025,
    phone: "+49 30 27594610", website: "https://www.games-workshop.com",
    hours: { Mon: "13:30–19:00", Tue: "11:30–19:00", Wed: "14:00–19:00", Thu: "11:30–19:00", Fri: "11:30–19:00", Sat: "11:00–19:00", Sun: "Closed" },
    verified: true, color: "#F5C542",
  },
];
