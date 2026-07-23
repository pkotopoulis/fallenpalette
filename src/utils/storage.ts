const KEY = "paintxref_collection";

export function loadCollection(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export function saveCollection(c: Set<string>) {
  try { localStorage.setItem(KEY, JSON.stringify([...c])); } catch {}
}
