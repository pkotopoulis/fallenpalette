import { DayKey } from "./data/types";

export type Lang = "en" | "el";

export interface Dict {
  langLabel: string;
  tagline: string;
  navMatch: string; navCollection: string; navStores: string;
  byName: string; byColour: string;
  searchNamePh: string;
  selectPaint: string;
  noPaintMatch: string;            // uses {q}
  directEquivalents: string; similarColours: string;
  brandsLoaded: string;            // unused reserve
  statPaints: string; statBrands: string; statStores: string;
  featured: string; shuffle: string; howItWorks: string;
  howSearchT: string; howSearchD: string;
  howCompareT: string; howCompareD: string;
  howSaveT: string; howSaveD: string;
  colourTitle: string; colourDesc: string; pick: string; hexCode: string;
  filterByBrand: string; closestTo: string;   // "{n} <closestTo> {hex}"
  rackEmptyTitle: string; rackPre: string; rackMid: string; rackPost: string;
  browsePaints: string; saveNote: string;
  total: string; filterColl: string;
  paintSing: string; paintPlur: string;
  exportL: string; importL: string; clearL: string;
  importConfirm: string;           // {n}
  importFail: string;              // {msg}
  clearConfirm: string;
  storeSearchPh: string; all: string;
  storeSing: string; storePlur: string;
  openingHours: string; hoursNotListed: string; closed: string;
  directions: string; noStoresMatch: string;
  days: Record<DayKey, string>;
  countries: Record<string, string>;
  matchExact: string; matchClose: string; matchApprox: string;
  addPaint: string; removePaint: string;
  footer: string;
}

const EN_DAYS: Record<DayKey, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};
const EL_DAYS: Record<DayKey, string> = {
  Mon: "Δευτέρα", Tue: "Τρίτη", Wed: "Τετάρτη", Thu: "Πέμπτη", Fri: "Παρασκευή", Sat: "Σάββατο", Sun: "Κυριακή",
};

const EL_COUNTRIES: Record<string, string> = {
  "Greece": "Ελλάδα",
  "United Kingdom": "Ηνωμένο Βασίλειο",
  "Germany": "Γερμανία",
  "France": "Γαλλία",
  "Belgium": "Βέλγιο",
  "Netherlands": "Ολλανδία",
  "Ireland": "Ιρλανδία",
  "Austria": "Αυστρία",
  "Spain": "Ισπανία",
  "Italy": "Ιταλία",
  "Denmark": "Δανία",
  "Sweden": "Σουηδία",
  "Norway": "Νορβηγία",
  "Finland": "Φινλανδία",
  "Poland": "Πολωνία",
  "Czechia": "Τσεχία",
};

export const I18N: Record<Lang, Dict> = {
  en: {
    langLabel: "EN",
    tagline: "Miniature Paint Cross-Reference · Collection · Store Finder",
    navMatch: "Colours", navCollection: "My Paints", navStores: "Stores",
    byName: "By name", byColour: "By colour",
    searchNamePh: 'Type a paint name, e.g. "Mephiston Red"…',
    selectPaint: "Select a paint",
    noPaintMatch: "No paints match “{q}”",
    directEquivalents: "Direct equivalents", similarColours: "Similar colours",
    brandsLoaded: "brands loaded",
    statPaints: "paints", statBrands: "brands", statStores: "stores",
    featured: "Featured cross-reference", shuffle: "Shuffle", howItWorks: "How it works",
    howSearchT: "Search", howSearchD: "Find any paint by name or pick a colour.",
    howCompareT: "Compare", howCompareD: "See equivalents across every brand.",
    howSaveT: "Save", howSaveD: "Track what you own in your rack.",
    colourTitle: "Search by colour",
    colourDesc: "Pick a colour or paste a hex code — we’ll find the closest paint matches across every brand.",
    pick: "Pick", hexCode: "Hex code",
    filterByBrand: "Filter by brand", closestTo: "closest matches to",
    rackEmptyTitle: "Your paint rack is empty",
    rackPre: "Search for a paint in ", rackMid: ", then hit the ", rackPost: " button on any result to save it here.",
    browsePaints: "Browse paints",
    saveNote: "💾 Your collection is saved locally on this device. Clearing browser data will remove it.",
    total: "Total", filterColl: "Filter your collection…",
    paintSing: "paint", paintPlur: "paints",
    exportL: "Export", importL: "Import", clearL: "Clear",
    importConfirm: "Import {n} paints? This will merge with your current collection.",
    importFail: "Failed to import: {msg}",
    clearConfirm: "Clear all paints from your collection?",
    storeSearchPh: "Search by city, postal code, or store name…", all: "All",
    storeSing: "store", storePlur: "stores",
    openingHours: "Opening hours", hoursNotListed: "Opening hours not listed yet.", closed: "Closed",
    directions: "Directions", noStoresMatch: "No stores match your search.",
    days: EN_DAYS,
    countries: {},
    matchExact: "Exact", matchClose: "Close", matchApprox: "Approx",
    addPaint: "Add to my paints", removePaint: "Remove from my paints",
    footer: "Fallen Palette · Data is approximate — always test swatches",
  },
  el: {
    langLabel: "ΕΛ",
    tagline: "Αντιστοίχιση Χρωμάτων Μινιατούρων · Συλλογή · Εύρεση Καταστημάτων",
    navMatch: "Χρώματα", navCollection: "Η Συλλογή μου", navStores: "Καταστήματα",
    byName: "Με όνομα", byColour: "Με χρώμα",
    searchNamePh: 'Πληκτρολόγησε όνομα χρώματος, π.χ. "Mephiston Red"…',
    selectPaint: "Διάλεξε ένα χρώμα",
    noPaintMatch: "Κανένα χρώμα δεν ταιριάζει με «{q}»",
    directEquivalents: "Άμεσα αντίστοιχα", similarColours: "Παρόμοια χρώματα",
    brandsLoaded: "μάρκες",
    statPaints: "χρώματα", statBrands: "μάρκες", statStores: "καταστήματα",
    featured: "Προτεινόμενη αντιστοίχιση", shuffle: "Ανακάτεμα", howItWorks: "Πώς λειτουργεί",
    howSearchT: "Αναζήτηση", howSearchD: "Βρες οποιοδήποτε χρώμα με όνομα ή διάλεξε ένα χρώμα.",
    howCompareT: "Σύγκριση", howCompareD: "Δες αντίστοιχα χρώματα σε κάθε μάρκα.",
    howSaveT: "Αποθήκευση", howSaveD: "Κράτα ό,τι έχεις στη συλλογή σου.",
    colourTitle: "Αναζήτηση με χρώμα",
    colourDesc: "Διάλεξε ένα χρώμα ή επικόλλησε έναν κωδικό hex — θα βρούμε τα πιο κοντινά χρώματα από κάθε μάρκα.",
    pick: "Επιλογή", hexCode: "Κωδικός hex",
    filterByBrand: "Φίλτρο ανά μάρκα", closestTo: "πιο κοντινές αντιστοιχίες με",
    rackEmptyTitle: "Η παλέτα σου είναι άδεια",
    rackPre: "Ψάξε ένα χρώμα στα ", rackMid: " και πάτα το ", rackPost: " σε όποιο αποτέλεσμα για να το αποθηκεύσεις εδώ.",
    browsePaints: "Περιήγηση χρωμάτων",
    saveNote: "💾 Η συλλογή σου αποθηκεύεται τοπικά σε αυτή τη συσκευή. Ο καθαρισμός των δεδομένων του browser θα τη διαγράψει.",
    total: "Σύνολο", filterColl: "Φιλτράρισμα συλλογής…",
    paintSing: "χρώμα", paintPlur: "χρώματα",
    exportL: "Εξαγωγή", importL: "Εισαγωγή", clearL: "Εκκαθάριση",
    importConfirm: "Εισαγωγή {n} χρωμάτων; Θα συγχωνευθούν με την τρέχουσα συλλογή σου.",
    importFail: "Αποτυχία εισαγωγής: {msg}",
    clearConfirm: "Εκκαθάριση όλων των χρωμάτων από τη συλλογή σου;",
    storeSearchPh: "Αναζήτηση με πόλη, ταχυδρομικό κώδικα ή όνομα καταστήματος…", all: "Όλα",
    storeSing: "κατάστημα", storePlur: "καταστήματα",
    openingHours: "Ώρες λειτουργίας", hoursNotListed: "Δεν υπάρχουν ακόμη ώρες λειτουργίας.", closed: "Κλειστά",
    directions: "Οδηγίες", noStoresMatch: "Κανένα κατάστημα δεν ταιριάζει με την αναζήτησή σου.",
    days: EL_DAYS,
    countries: EL_COUNTRIES,
    matchExact: "Ακριβές", matchClose: "Κοντινό", matchApprox: "Κατά προσέγγ.",
    addPaint: "Προσθήκη στα χρώματά μου", removePaint: "Αφαίρεση από τα χρώματά μου",
    footer: "Fallen Palette · Τα δεδομένα είναι κατά προσέγγιση — δοκίμαζε πάντα δείγματα.",
  },
};
