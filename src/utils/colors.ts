export function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function colorDistance(a: string, b: string): number {
  const c1 = hexToRgb(a), c2 = hexToRgb(b);
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function matchLabel(d: number) { return d < 15 ? "Exact" : d < 35 ? "Close" : "Approx"; }
export function matchBg(d: number) { return d < 15 ? "#22C55E20" : d < 35 ? "#F4A02420" : "#EF444420"; }
export function matchFg(d: number) { return d < 15 ? "#4ADE80" : d < 35 ? "#FBB040" : "#F87171"; }
