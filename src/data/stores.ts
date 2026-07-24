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

  // ─── France ───
  { id: 13, name: "Warhammer – Paris 12", city: "Paris", country: "France", postal: "75012", address: "38 Avenue Daumesnil", lat: 48.846704, lng: 2.376185, phone: "+33 1 53 44 71 82", website: "https://www.games-workshop.com/Warhammer-Paris-12",
    hours: { Mon: "Closed", Tue: "11:00–13:00, 14:00–19:00", Wed: "11:00–13:00, 14:00–19:00", Thu: "14:00–19:00", Fri: "11:00–13:00, 14:00–21:00", Sat: "10:00–19:00", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Belgium ───
  { id: 14, name: "Warhammer – Antwerpen", city: "Antwerpen", country: "Belgium", postal: "2000", address: "Vleminckstraat 10", lat: 51.219773, lng: 4.403660, phone: "+32 3 485 86 27", website: "https://www.games-workshop.com/Warhammer-Antwerpen",
    hours: { Mon: "11:00–14:00, 14:30–18:00", Tue: "11:00–14:00, 14:30–18:00", Wed: "11:00–14:00, 14:30–18:00", Thu: "11:00–14:00, 14:30–18:00", Fri: "11:00–16:00, 16:30–20:00", Sat: "11:00–14:00, 14:30–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Netherlands ───
  { id: 15, name: "Warhammer – Amsterdam West", city: "Amsterdam", country: "Netherlands", postal: "1016 LT", address: "Rozengracht 99", lat: 52.373073, lng: 4.880078, phone: "+31 20 623 2800", website: "https://www.games-workshop.com/en-WW/Warhammer-Amsterdam-West",
    hours: { Mon: "12:00–18:00", Tue: "12:00–18:00", Wed: "12:00–18:00", Thu: "12:00–18:00", Fri: "12:00–18:00", Sat: "11:00–18:00", Sun: "12:00–17:00" }, verified: true, color: "#F5C542" },

  // ─── Ireland ───
  { id: 16, name: "Warhammer – Dublin", city: "Dublin", country: "Ireland", postal: "D01", address: "Unit 3, Lower Liffey Street", lat: 53.346827, lng: -6.263152, phone: "+353 1 872 5791", website: "https://www.games-workshop.com/Warhammer-Dublin",
    hours: { Mon: "10:00–18:00", Tue: "10:00–22:00", Wed: "10:00–18:00", Thu: "10:00–22:00", Fri: "10:00–18:00", Sat: "10:00–18:00", Sun: "11:00–18:00" }, verified: true, color: "#F5C542" },

  // ─── United Kingdom (more cities) ───
  { id: 17, name: "Warhammer – Manchester", city: "Manchester", country: "United Kingdom", postal: "M4 3AT", address: "Unit R35, Arndale Centre, Marsden Way South", lat: 53.483004, lng: -2.241438, phone: "+44 161 834 6871", website: "https://www.games-workshop.com/Warhammer-Manchester",
    hours: { Mon: "10:00–21:00", Tue: "10:00–21:00", Wed: "10:00–21:00", Thu: "10:00–21:00", Fri: "10:00–18:00", Sat: "10:00–18:00", Sun: "11:00–17:00" }, verified: true, color: "#F5C542" },
  { id: 18, name: "Warhammer – Birmingham", city: "Birmingham", country: "United Kingdom", postal: "B4 7LA", address: "36 Priory Queensway", lat: 52.481419, lng: -1.891071, phone: "+44 121 233 4840", website: "https://www.games-workshop.com/Warhammer-Birmingham",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "12:00–20:00", Fri: "12:00–20:00", Sat: "10:00–18:00", Sun: "11:00–17:00" }, verified: true, color: "#F5C542" },
  { id: 19, name: "Warhammer – Leeds", city: "Leeds", country: "United Kingdom", postal: "LS1 6LY", address: "155 Briggate", lat: 53.797574, lng: -1.542261, phone: "+44 113 242 0834", website: "https://www.games-workshop.com/Warhammer-Leeds",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "10:00–18:00", Fri: "10:00–20:00", Sat: "09:30–18:00", Sun: "11:00–18:00" }, verified: true, color: "#F5C542" },
  { id: 20, name: "Warhammer – Edinburgh", city: "Edinburgh", country: "United Kingdom", postal: "EH1 1QS", address: "136 High Street", lat: 55.949893, lng: -3.188566, phone: "+44 131 220 6540", website: "https://www.games-workshop.com/Warhammer-Edinburgh",
    hours: { Mon: "10:00–18:00", Tue: "10:00–22:00", Wed: "10:00–18:00", Thu: "10:00–18:00", Fri: "10:00–18:00", Sat: "10:00–18:00", Sun: "11:00–19:00" }, verified: true, color: "#F5C542" },
  { id: 21, name: "Warhammer – Glasgow", city: "Glasgow", country: "United Kingdom", postal: "G1 3TA", address: "81 Union Street", lat: 55.860165, lng: -4.256941, phone: "+44 141 221 1673", website: "https://www.games-workshop.com/Warhammer-Glasgow",
    hours: { Mon: "10:00–18:00", Tue: "10:00–21:00", Wed: "11:00–18:00", Thu: "10:00–21:00", Fri: "10:00–18:00", Sat: "09:30–18:00", Sun: "11:00–18:00" }, verified: true, color: "#F5C542" },
  { id: 22, name: "Warhammer – Bristol", city: "Bristol", country: "United Kingdom", postal: "BS1 2BQ", address: "33b Wine Street", lat: 51.455372, lng: -2.591688, phone: "+44 117 925 1533", website: "https://www.games-workshop.com/Warhammer-Bristol",
    hours: { Mon: "11:00–18:00", Tue: "11:00–18:00", Wed: "11:00–20:00", Thu: "11:00–18:00", Fri: "11:00–18:00", Sat: "10:00–18:00", Sun: "11:00–17:00" }, verified: true, color: "#F5C542" },
  { id: 23, name: "Warhammer – Cardiff", city: "Cardiff", country: "United Kingdom", postal: "CF10 1PT", address: "20 High Street", lat: 51.480337, lng: -3.180107, phone: "+44 29 2064 4917", website: "https://www.games-workshop.com/Warhammer-Cardiff",
    hours: { Mon: "10:30–18:00", Tue: "10:00–18:00", Wed: "10:00–20:00", Thu: "10:00–18:00", Fri: "10:00–18:00", Sat: "10:00–18:00", Sun: "11:00–17:00" }, verified: true, color: "#F5C542" },

  // ─── Germany (more cities) ───
  { id: 24, name: "Warhammer – München", city: "München", country: "Germany", postal: "80469", address: "Rumfordstraße 9", lat: 48.1334849, lng: 11.5770605, phone: "+49 89 21266665", website: "https://www.warhammer.com/shop/Warhammer-Muenchen",
    hours: { Mon: "11:30–19:30", Tue: "11:30–19:30", Wed: "11:30–19:30", Thu: "11:30–19:30", Fri: "11:30–20:00", Sat: "11:00–19:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 25, name: "Warhammer – Hamburg", city: "Hamburg", country: "Germany", postal: "20354", address: "Colonnaden 15", lat: 53.5555808, lng: 9.9904397, phone: "+49 40 35713164", website: "https://www.warhammer.com/shop/Warhammer-Hamburg",
    hours: { Mon: "11:00–18:00", Tue: "11:00–18:00", Wed: "11:00–18:00", Thu: "11:00–18:00", Fri: "11:00–18:00", Sat: "11:00–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 26, name: "Warhammer – Köln", city: "Köln", country: "Germany", postal: "50667", address: "Cäcilienstraße 42-44", lat: 50.935637, lng: 6.950704, phone: "+49 221 2577707", website: "https://www.warhammer.com/shop/Warhammer-Koeln",
    hours: { Mon: "13:30–18:00", Tue: "13:30–18:00", Wed: "10:30–18:00", Thu: "10:30–18:00", Fri: "10:30–18:00", Sat: "10:30–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 27, name: "Warhammer – Frankfurt", city: "Frankfurt am Main", country: "Germany", postal: "60313", address: "Große Friedberger Straße 30", lat: 50.1159745, lng: 8.6863403, phone: "+49 69 21999266", website: "https://www.warhammer.com/shop/Warhammer-Frankfurt",
    hours: { Mon: "12:00–19:00", Tue: "12:00–19:00", Wed: "12:00–19:00", Thu: "12:00–19:00", Fri: "12:00–19:00", Sat: "11:00–19:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 28, name: "Warhammer – Stuttgart", city: "Stuttgart", country: "Germany", postal: "70173", address: "Königstraße 49", lat: 48.7737602, lng: 9.1753356, phone: "+49 711 2294860", website: "https://www.warhammer.com/shop/Warhammer-Stuttgart",
    hours: { Mon: "10:30–18:00", Tue: "13:30–18:00", Wed: "10:30–18:00", Thu: "10:30–18:00", Fri: "10:30–18:00", Sat: "10:30–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 29, name: "Warhammer – Düsseldorf", city: "Düsseldorf", country: "Germany", postal: "40211", address: "Am Wehrhahn 32", lat: 51.2283109, lng: 6.7902336, phone: "+49 211 17544090", website: "https://www.warhammer.com/shop/Warhammer-Duesseldorf",
    hours: { Mon: "Closed", Tue: "13:30–18:00", Wed: "10:30–18:00", Thu: "10:30–18:00", Fri: "10:30–18:00", Sat: "10:30–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 30, name: "Warhammer – Dresden", city: "Dresden", country: "Germany", postal: "01067", address: "Schweriner Straße 23", lat: 51.0520574, lng: 13.7285128, phone: "+49 351 2069715", website: "https://www.warhammer.com/shop/Warhammer-Dresden",
    hours: { Mon: "Closed", Tue: "11:00–18:00", Wed: "13:00–18:00", Thu: "11:00–18:00", Fri: "11:00–18:00", Sat: "11:00–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Austria ───
  { id: 31, name: "Warhammer – Wien (Gasometer)", city: "Wien", country: "Austria", postal: "1110", address: "Guglgasse 6, Gasometer A", lat: 48.1851432, lng: 16.4184060, phone: "+43 1 7431038", website: "https://www.warhammer.com/shop/Warhammer-Wien",
    hours: { Mon: "11:00–19:00", Tue: "12:00–19:00", Wed: "14:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "11:00–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 32, name: "Warhammer – Wien (Westbahnhof)", city: "Wien", country: "Austria", postal: "1150", address: "Europaplatz 2, BahnhofCity Wien West", lat: 48.1968033, lng: 16.3376784, phone: "+43 1 5223178", website: "https://www.warhammer.com/shop/Warhammer-Wien-Westbahnhof",
    hours: { Mon: "10:00–19:00", Tue: "10:00–19:00", Wed: "10:00–19:00", Thu: "10:00–19:00", Fri: "10:00–19:00", Sat: "10:00–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 33, name: "Warhammer – Graz", city: "Graz", country: "Austria", postal: "8010", address: "Hamerlinggasse 4", lat: 47.0690467, lng: 15.4422817, phone: "+43 316 812105", website: "https://www.warhammer.com/shop/Warhammer-Graz",
    hours: { Mon: "Closed", Tue: "12:30–18:00", Wed: "12:30–18:00", Thu: "10:30–18:00", Fri: "10:30–18:00", Sat: "10:30–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Spain ───
  { id: 34, name: "Warhammer – Madrid (Argüelles)", city: "Madrid", country: "Spain", postal: "28015", address: "Calle de Andrés Mellado 10", lat: 40.4335, lng: -3.7146, phone: "+34 915 44 22 92", website: "https://www.warhammer.com/shop/Warhammer-Arguelles",
    hours: { Mon: "Closed", Tue: "10:30–14:30, 17:00–20:30", Wed: "10:30–14:00, 17:00–20:30", Thu: "10:30–14:00, 17:00–20:30", Fri: "10:30–14:00, 17:00–20:30", Sat: "10:30–14:00, 16:30–20:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 35, name: "Warhammer – Barcelona (Déu i Mata)", city: "Barcelona", country: "Spain", postal: "08029", address: "Carrer de Déu i Mata 96", lat: 41.3853, lng: 2.1440, phone: "+34 934 10 15 21", website: "https://www.warhammer.com/shop/Warhammer-Deu-i-Mata",
    hours: { Mon: "Closed", Tue: "10:30–14:00, 16:30–20:00", Wed: "10:30–14:00, 16:30–20:00", Thu: "10:30–14:00, 16:30–20:00", Fri: "10:30–14:00, 16:30–20:00", Sat: "10:30–15:00, 16:30–20:30", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 36, name: "Warhammer – València", city: "Valencia", country: "Spain", postal: "46002", address: "Carrer d'Osca (Calle Huesca) 4", lat: 39.4618, lng: -0.3722, phone: "+34 963 51 57 27", website: "https://www.warhammer.com/shop/Warhammer-Valencia",
    hours: { Mon: "10:00–14:00, 17:00–20:00", Tue: "10:00–14:00, 17:00–20:00", Wed: "10:00–14:00, 17:00–20:00", Thu: "10:00–14:00, 17:00–20:00", Fri: "10:00–14:00, 17:00–20:00", Sat: "10:00–14:00, 17:00–20:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 37, name: "Warhammer – Sevilla", city: "Sevilla", country: "Spain", postal: "41003", address: "Avenida José Laguillo 12", lat: 37.3905, lng: -5.9765, phone: "+34 954 90 06 24", website: "https://www.warhammer.com/shop/Warhammer-Sevilla",
    hours: { Mon: "Closed", Tue: "11:00–14:00, 18:00–21:30", Wed: "11:00–14:00, 18:00–21:30", Thu: "11:00–14:00, 18:00–21:30", Fri: "11:00–14:00, 17:00–20:30", Sat: "11:00–14:00, 18:00–21:30", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Italy ───
  { id: 38, name: "Warhammer – Roma (Centro)", city: "Roma", country: "Italy", postal: "00186", address: "Via del Pellegrino 94", lat: 41.8965, lng: 12.4710, phone: "+39 06 2320 9668", website: "https://www.warhammer.com/shop/Warhammer-Roma-Centro",
    hours: { Mon: "10:00–19:00", Tue: "10:00–19:00", Wed: "10:00–19:00", Thu: "10:00–19:00", Fri: "10:00–19:00", Sat: "10:00–19:00", Sun: "10:00–19:00" }, verified: true, color: "#F5C542" },
  { id: 39, name: "Warhammer – Milano", city: "Milano", country: "Italy", postal: "20123", address: "Via San Sisto 5", lat: 45.4605, lng: 9.1795, phone: "+39 02 8645 8490", website: "https://www.warhammer.com/shop/Warhammer-Milano",
    hours: { Mon: "11:00–14:00, 15:00–19:00", Tue: "11:00–14:00, 15:00–19:00", Wed: "11:00–14:00, 15:00–19:00", Thu: "11:00–14:00, 15:00–19:00", Fri: "11:00–14:00, 15:00–19:00", Sat: "11:00–19:00", Sun: "11:00–19:00" }, verified: true, color: "#F5C542" },
  { id: 40, name: "Warhammer – Torino", city: "Torino", country: "Italy", postal: "10122", address: "Via San Dalmazzo 3", lat: 45.0715, lng: 7.6805, phone: "+39 011 562 8472", website: "https://www.warhammer.com/shop/Warhammer-Torino",
    hours: { Mon: "11:00–19:00", Tue: "11:00–19:00", Wed: "11:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "11:00–19:00", Sun: "Closed" }, verified: true, color: "#F5C542" },
  { id: 41, name: "Warhammer – Bologna", city: "Bologna", country: "Italy", postal: "40121", address: "Piazza Roosevelt 4", lat: 44.4948, lng: 11.3405, phone: "+39 051 656 9825", website: "https://www.warhammer.com/shop/Warhammer-Bologna",
    hours: { Mon: "Closed", Tue: "11:00–13:00, 14:30–19:30", Wed: "14:30–19:30", Thu: "11:00–13:00, 14:30–19:30", Fri: "11:00–13:00, 14:30–19:30", Sat: "11:00–13:00, 14:30–19:30", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Denmark ───
  { id: 42, name: "Warhammer – København", city: "København", country: "Denmark", postal: "1159", address: "Skindergade 44", lat: 55.6798, lng: 12.5715, phone: "+45 33 12 22 17", website: "https://www.warhammer.com/shop/Warhammer-Copenhagen",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "10:00–18:00", Fri: "10:00–18:00", Sat: "10:00–17:00", Sun: "10:00–17:00" }, verified: true, color: "#F5C542" },

  // ─── Sweden ───
  { id: 43, name: "Warhammer – Stockholm", city: "Stockholm", country: "Sweden", postal: "111 21", address: "Mäster Samuelsgatan 67", lat: 59.3352, lng: 18.0585, phone: "+46 8 21 38 40", website: "https://www.warhammer.com/shop/Warhammer-Stockholm",
    hours: { Mon: "10:00–18:00", Tue: "10:00–18:00", Wed: "10:00–18:00", Thu: "11:00–17:00", Fri: "10:00–18:00", Sat: "11:00–18:00", Sun: "11:00–17:00" }, verified: true, color: "#F5C542" },

  // ─── Norway ───
  { id: 44, name: "Warhammer – Oslo", city: "Oslo", country: "Norway", postal: "0179", address: "Møllergata 5", lat: 59.9142, lng: 10.7480, phone: "+47 22 33 29 90", website: "https://www.warhammer.com/shop/Warhammer-Oslo",
    hours: { Mon: "11:00–19:00", Tue: "11:00–19:00", Wed: "11:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "10:00–18:00", Sun: "Closed" }, verified: true, color: "#F5C542" },

  // ─── Finland ───
  { id: 45, name: "Warhammer – Helsinki", city: "Helsinki", country: "Finland", postal: "00100", address: "Antinkatu 3", lat: 60.1668, lng: 24.9335, phone: "+358 9 7515 4525", website: "https://www.warhammer.com/shop/Warhammer-Helsinki",
    hours: { Mon: "11:00–19:00", Tue: "11:00–19:00", Wed: "11:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "11:00–18:00", Sun: "10:00–16:00" }, verified: true, color: "#F5C542" },

  // ─── Poland ───
  { id: 46, name: "Warhammer – Warszawa (Złote Tarasy)", city: "Warszawa", country: "Poland", postal: "00-120", address: "ul. Złota 59 (Złote Tarasy, lok. 215)", lat: 52.2305, lng: 21.0005, phone: "+48 22 222 01 33", website: "https://www.warhammer.com/shop/Warhammer-Warszawa",
    hours: { Mon: "09:00–22:00", Tue: "09:00–22:00", Wed: "09:00–22:00", Thu: "09:00–22:00", Fri: "09:00–22:00", Sat: "09:00–22:00", Sun: "09:00–21:00" }, verified: true, color: "#F5C542" },

  // ─── Czechia ───
  { id: 47, name: "Warhammer – Prague", city: "Praha", country: "Czechia", postal: "110 00", address: "Na Příkopě 853/12", lat: 50.085163, lng: 14.425507, phone: "+420 735 751 031", website: "https://www.warhammer.com/shop/Warhammer-Prague",
    hours: { Mon: "11:00–19:00", Tue: "11:00–19:00", Wed: "11:00–19:00", Thu: "11:00–19:00", Fri: "11:00–19:00", Sat: "10:30–19:00", Sun: "11:00–19:00" }, verified: true, color: "#F5C542" },
];
