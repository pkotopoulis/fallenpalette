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

/** Export collection as a downloadable JSON file */
export function exportCollection(c: Set<string>) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    paints: [...c],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `paintxref-collection-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Import collection from a JSON file */
export function importCollection(file: File): Promise<Set<string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && Array.isArray(data.paints)) {
          resolve(new Set(data.paints));
        } else {
          reject(new Error("Invalid backup file format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
