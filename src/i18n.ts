import { DayKey } from "./data/types";

export type Lang = "en" | "el";

export interface Dict {
  langLabel: string;
  tagline: string;
  navMatch: string; navCollection: string; navStores: string;
  byName: string; byColour: string; byPhoto: string;
  searchNamePh: string;
  selectPaint: string;
  noPaintMatch: string;            // uses {q}
  directEquivalents: string; similarColours: string;
  shadingTriad: string; triadShade: string; triadBase: string; triadHighlight: string; triadHint: string;
  metaDefault: string; metaPaint: string; metaPaintBare: string; metaIndex: string;
  allPaints: string; allPaintsHint: string; backToSearch: string;
  filterPaintsPh: string; noPaintsMatch: string; showingPaints: string;
  nearMe: string; nearMeLocating: string; nearMeDenied: string; nearMeUnavailable: string;
  nearMeOn: string; nearMeClear: string; distanceUnknown: string;
  brandsLoaded: string;            // unused reserve
  statPaints: string; statBrands: string; statStores: string;
  featured: string; featuredAcross: string; shuffle: string; howItWorks: string;
  howSearchT: string; howSearchD: string;
  howCompareT: string; howCompareD: string;
  howSaveT: string; howSaveD: string;
  colourTitle: string; colourDesc: string; pick: string; hexCode: string;
  filterByBrand: string; closestTo: string;   // "{n} <closestTo> {hex}"
  filterByRange: string; rangeKinds: Record<string, string>;
  fromYourPaints: string; fromYourPaintsHint: string; curatedMatch: string; ownedNone: string;
  mixIt: string; mixHint: string; mixParts: string;
  photoTitle: string; photoDesc: string; photoPrivacy: string; photoPick: string;
  photoAgain: string; photoWorking: string; photoFailed: string; photoShare: string;
  whereToBuy: string; buyChoose: string; buyHint: string; affiliateNote: string; affiliateFooter: string; restock: string;
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
  cvdLabel: string; cvdOff: string;
  cvdProtanopia: string; cvdDeuteranopia: string; cvdTritanopia: string;
  cvdSimulate: string; cvdSimulateOn: string;
  cvdSameToYou: string; cvdSameToYouTitle: string;   // {normal}
  cvdPairsTitle: string; cvdPairsHint: string; cvdPairsNone: string;
  cvdPairsSeen: string;                              // {normal} {seen}
  cvdPairsMore: string;                              // {n}
  footer: string; copyright: string; disclaimer: string;
  feedback: string;
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
    navMatch: "Colour search", navCollection: "My Paints", navStores: "Stores",
    byName: "By name", byColour: "By colour", byPhoto: "From a photo",
    searchNamePh: 'Type a paint name, e.g. "Mephiston Red"…',
    selectPaint: "Select a paint",
    noPaintMatch: "No paints match “{q}”",
    directEquivalents: "Direct equivalents", similarColours: "Similar colours",
    shadingTriad: "Shading triad", triadShade: "Shade", triadBase: "Base", triadHighlight: "Highlight",
    triadHint: "Same colour, darker and lighter — for recesses and edges",
    metaDefault: "Cross-reference miniature paints across Citadel, Vallejo, Army Painter, AK, Scale75, Two Thin Coats and Pro Acryl. Find equivalents, shades and highlights.",
    metaPaint: "{name} by {brand} ({hex}) — find equivalents in {brands}, plus matching shades and highlights for your miniatures.",
    metaPaintBare: "{name} by {brand} — find the closest matching paints from other brands, plus shades and highlights.",
    metaIndex: "Browse all {count} miniature paints in the Fallen Palette cross-reference, grouped by brand.",
    allPaints: "All paints", allPaintsHint: "Every paint in the cross-reference, grouped by brand",
    filterPaintsPh: "Filter by name, brand or range…",
    noPaintsMatch: "No paints match “{q}”",
    showingPaints: "{n} of {total} paints",
    nearMe: "Sort by nearest",
    nearMeLocating: "Finding your location…",
    nearMeDenied: "Location permission was declined, so stores are in their usual order.",
    nearMeUnavailable: "Your browser could not provide a location, so stores are in their usual order.",
    nearMeOn: "Nearest first",
    nearMeClear: "Clear",
    distanceUnknown: "location not mapped",
    backToSearch: "Back to search",
    brandsLoaded: "brands loaded",
    statPaints: "paints", statBrands: "brands", statStores: "stores",
    featured: "Featured cross-reference", featuredAcross: "The same colour across {n} of {total} brands",
    shuffle: "Shuffle", howItWorks: "How it works",
    howSearchT: "Search", howSearchD: "Find any paint by name or pick a colour.",
    howCompareT: "Compare", howCompareD: "See equivalents across every brand.",
    howSaveT: "Save", howSaveD: "Track what you own in your rack.",
    colourTitle: "Search by colour",
    colourDesc: "Pick a colour or paste a hex code — we’ll find the closest paint matches across every brand.",
    pick: "Pick", hexCode: "Hex code",
    filterByBrand: "Filter by brand", closestTo: "closest matches to",
    fromYourPaints: "From your paints",
    fromYourPaintsHint: "The closest thing you already own — test a swatch before committing.",
    curatedMatch: "Known match",
    mixIt: "Or mix it",
    mixHint: "Predicted from the colours, not from how pigments really behave — mix a swatch and check before you commit. Complementary pairs are not offered, because the maths cannot predict them.",
    mixParts: "{parts} parts",
    photoTitle: "Palette from a photo",
    photoDesc: "Drop in a photo or a piece of reference art and we’ll pull out its main colours, then match each to real paints.",
    photoPrivacy: "The image is read on your device and never uploaded.",
    photoPick: "Choose an image",
    photoAgain: "Choose another",
    photoWorking: "Reading the image…",
    photoFailed: "That file could not be read as an image.",
    photoShare: "{n}% of the image",
    ownedNone: "Nothing in your collection is close to this one.",
    whereToBuy: "Where to buy", buyChoose: "Choose a shop",
    buyHint: "Searches each shop for this paint — stock and prices are theirs, not ours.",
    affiliateNote: "Affiliate links: we may earn a commission on purchases, at no extra cost to you.",
    affiliateFooter: "Some outbound shop links are affiliate links — we may earn a commission from purchases made through them, at no extra cost to you.",
    restock: "Buy",
    filterByRange: "Filter by range",
    rangeKinds: { opaque: "Opaque", speed: "Speed paints", wash: "Washes", metallic: "Metallics", technical: "Technical" },
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
    cvdLabel: "Colour vision",
    cvdOff: "No adjustment",
    cvdProtanopia: "Protanopia (red-blind)",
    cvdDeuteranopia: "Deuteranopia (green-blind)",
    cvdTritanopia: "Tritanopia (blue-blind)",
    cvdSimulate: "Show me the simulation",
    cvdSimulateOn: "Simulating",
    cvdSameToYou: "Same to you",
    cvdSameToYouTitle: "We rate this {normal} away from your paint, but with the colour vision you selected the two are indistinguishable — so it will substitute perfectly for you.",
    cvdPairsTitle: "Paints you may not be able to tell apart",
    cvdPairsHint: "These pairs look clearly different to most people, which is why nothing else in the app flags them — but with the colour vision you selected they read as the same colour. Worth labelling the pots.",
    cvdPairsNone: "Nothing in your collection should be hard to tell apart.",
    cvdPairsSeen: "{normal} apart normally · {seen} to you",
    cvdPairsMore: "and {n} more",
    footer: "Fallen Palette · Data is approximate — always test swatches",
    copyright: "© 2026 Fallen Palette. All rights reserved.",
    disclaimer: "Unofficial fan-made tool — not affiliated with, endorsed by, or sponsored by Games Workshop. Warhammer and all associated marks are trademarks of Games Workshop Ltd. Paint names and colours are trademarks of their respective manufacturers.",
    feedback: "Report a missing store or wrong info",
  },
  el: {
    langLabel: "ΕΛ",
    tagline: "Αντιστοίχιση Χρωμάτων Μινιατούρων · Συλλογή · Εύρεση Καταστημάτων",
    navMatch: "Αναζήτηση χρώματος", navCollection: "Η Συλλογή μου", navStores: "Καταστήματα",
    byName: "Με όνομα", byColour: "Με χρώμα", byPhoto: "Από φωτογραφία",
    searchNamePh: 'Πληκτρολόγησε όνομα χρώματος, π.χ. "Mephiston Red"…',
    selectPaint: "Διάλεξε ένα χρώμα",
    noPaintMatch: "Κανένα χρώμα δεν ταιριάζει με «{q}»",
    directEquivalents: "Άμεσα αντίστοιχα", similarColours: "Παρόμοια χρώματα",
    shadingTriad: "Τριάδα σκίασης", triadShade: "Σκίαση", triadBase: "Βάση", triadHighlight: "Φωτισμός",
    triadHint: "Ίδιο χρώμα, πιο σκούρο και πιο ανοιχτό — για εσοχές και ακμές",
    metaDefault: "Αντιστοίχιση χρωμάτων μινιατούρων μεταξύ Citadel, Vallejo, Army Painter, AK, Scale75, Two Thin Coats και Pro Acryl. Βρες αντίστοιχα, σκιάσεις και φωτισμούς.",
    metaPaint: "{name} της {brand} ({hex}) — βρες αντίστοιχα σε {brands}, μαζί με σκιάσεις και φωτισμούς για τις μινιατούρες σου.",
    metaPaintBare: "{name} της {brand} — βρες τα πιο κοντινά χρώματα από άλλες μάρκες, μαζί με σκιάσεις και φωτισμούς.",
    metaIndex: "Δες όλα τα {count} χρώματα μινιατούρων στο Fallen Palette, ομαδοποιημένα κατά μάρκα.",
    allPaints: "Όλα τα χρώματα", allPaintsHint: "Κάθε χρώμα στη βάση, ομαδοποιημένο κατά μάρκα",
    filterPaintsPh: "Φίλτρο ανά όνομα, μάρκα ή σειρά…",
    noPaintsMatch: "Κανένα χρώμα δεν ταιριάζει με «{q}»",
    showingPaints: "{n} από {total} χρώματα",
    nearMe: "Ταξινόμηση κατά εγγύτητα",
    nearMeLocating: "Εντοπισμός τοποθεσίας…",
    nearMeDenied: "Η άδεια τοποθεσίας απορρίφθηκε, οπότε τα καταστήματα είναι στη συνήθη σειρά.",
    nearMeUnavailable: "Ο browser δεν μπόρεσε να δώσει τοποθεσία, οπότε τα καταστήματα είναι στη συνήθη σειρά.",
    nearMeOn: "Πλησιέστερα πρώτα",
    nearMeClear: "Καθαρισμός",
    distanceUnknown: "χωρίς καταχωρημένη θέση",
    backToSearch: "Πίσω στην αναζήτηση",
    brandsLoaded: "μάρκες",
    statPaints: "χρώματα", statBrands: "μάρκες", statStores: "καταστήματα",
    featured: "Προτεινόμενη αντιστοίχιση", featuredAcross: "Το ίδιο χρώμα σε {n} από {total} μάρκες",
    shuffle: "Ανακάτεμα", howItWorks: "Πώς λειτουργεί",
    howSearchT: "Αναζήτηση", howSearchD: "Βρες οποιοδήποτε χρώμα με όνομα ή διάλεξε ένα χρώμα.",
    howCompareT: "Σύγκριση", howCompareD: "Δες αντίστοιχα χρώματα σε κάθε μάρκα.",
    howSaveT: "Αποθήκευση", howSaveD: "Κράτα ό,τι έχεις στη συλλογή σου.",
    colourTitle: "Αναζήτηση με χρώμα",
    colourDesc: "Διάλεξε ένα χρώμα ή επικόλλησε έναν κωδικό hex — θα βρούμε τα πιο κοντινά χρώματα από κάθε μάρκα.",
    pick: "Επιλογή", hexCode: "Κωδικός hex",
    filterByBrand: "Φίλτρο ανά μάρκα", closestTo: "πιο κοντινές αντιστοιχίες με",
    fromYourPaints: "Από τα χρώματά σου",
    fromYourPaintsHint: "Το πιο κοντινό που έχεις ήδη — δοκίμασε δείγμα πριν το χρησιμοποιήσεις.",
    curatedMatch: "Γνωστή αντιστοιχία",
    mixIt: "Ή φτιάξε το με μίξη",
    mixHint: "Πρόβλεψη από τα χρώματα, όχι από τη συμπεριφορά των πιγμέντων — δοκίμασε δείγμα πρώτα. Συμπληρωματικά ζεύγη δεν προτείνονται, γιατί δεν μπορούν να προβλεφθούν.",
    mixParts: "{parts} μέρη",
    photoTitle: "Παλέτα από φωτογραφία",
    photoDesc: "Ανέβασε μια φωτογραφία ή εικόνα αναφοράς και θα βγάλουμε τα κύρια χρώματα, αντιστοιχισμένα σε πραγματικά χρώματα.",
    photoPrivacy: "Η εικόνα διαβάζεται στη συσκευή σου και δεν ανεβαίνει πουθενά.",
    photoPick: "Διάλεξε εικόνα",
    photoAgain: "Διάλεξε άλλη",
    photoWorking: "Ανάγνωση εικόνας…",
    photoFailed: "Το αρχείο δεν μπόρεσε να διαβαστεί ως εικόνα.",
    photoShare: "{n}% της εικόνας",
    ownedNone: "Τίποτα στη συλλογή σου δεν είναι κοντά σε αυτό.",
    whereToBuy: "Πού να το αγοράσεις", buyChoose: "Διάλεξε κατάστημα",
    buyHint: "Αναζητά το χρώμα σε κάθε κατάστημα — το στοκ και οι τιμές είναι δικά τους, όχι δικά μας.",
    affiliateNote: "Συνδέσμοι συνεργατών: μπορεί να κερδίσουμε προμήθεια από αγορές, χωρίς επιπλέον κόστος για εσένα.",
    affiliateFooter: "Ορισμένοι σύνδεσμοι προς καταστήματα είναι σύνδεσμοι συνεργατών — μπορεί να κερδίσουμε προμήθεια από αγορές μέσω αυτών, χωρίς επιπλέον κόστος για εσένα.",
    restock: "Αγορά",
    filterByRange: "Φίλτρο ανά σειρά",
    rangeKinds: { opaque: "Καλυπτικά", speed: "Speed paints", wash: "Πλυσίματα", metallic: "Μεταλλικά", technical: "Τεχνικά" },
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
    cvdLabel: "Χρωματική όραση",
    cvdOff: "Χωρίς προσαρμογή",
    cvdProtanopia: "Πρωτανοπία (αδυναμία στο κόκκινο)",
    cvdDeuteranopia: "Δευτερανοπία (αδυναμία στο πράσινο)",
    cvdTritanopia: "Τριτανοπία (αδυναμία στο μπλε)",
    cvdSimulate: "Δείξε μου την προσομοίωση",
    cvdSimulateOn: "Προσομοίωση",
    cvdSameToYou: "Ίδιο για εσένα",
    cvdSameToYouTitle: "Το βαθμολογούμε σε απόσταση {normal} από το χρώμα σου, αλλά με τη χρωματική όραση που επέλεξες τα δύο δεν διακρίνονται — οπότε για εσένα υποκαθιστά απόλυτα.",
    cvdPairsTitle: "Χρώματα που μπορεί να μην ξεχωρίζεις",
    cvdPairsHint: "Αυτά τα ζεύγη φαίνονται καθαρά διαφορετικά στους περισσότερους, γι’ αυτό τίποτα άλλο στην εφαρμογή δεν τα επισημαίνει — αλλά με τη χρωματική όραση που επέλεξες διαβάζονται ως το ίδιο χρώμα. Αξίζει να σημάνεις τα δοχεία.",
    cvdPairsNone: "Τίποτα στη συλλογή σου δεν θα πρέπει να είναι δυσδιάκριτο.",
    cvdPairsSeen: "απόσταση {normal} κανονικά · {seen} για εσένα",
    cvdPairsMore: "και {n} ακόμη",
    footer: "Fallen Palette · Τα δεδομένα είναι κατά προσέγγιση — δοκίμαζε πάντα δείγματα.",
    copyright: "© 2026 Fallen Palette. Με επιφύλαξη παντός δικαιώματος.",
    disclaimer: "Ανεπίσημο εργαλείο από φαν — δεν σχετίζεται, δεν εγκρίνεται και δεν χορηγείται από την Games Workshop. Το Warhammer και τα σχετικά σήματα είναι εμπορικά σήματα της Games Workshop Ltd. Τα ονόματα και τα χρώματα βαφών είναι εμπορικά σήματα των αντίστοιχων κατασκευαστών.",
    feedback: "Ανέφερε κατάστημα που λείπει ή λάθος στοιχεία",
  },
};
