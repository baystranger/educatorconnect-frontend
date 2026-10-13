/**
 * Illustrated placeholder covers used when a centre has no photos yet
 * (the same soft palettes as the design's centre cards).
 */
const PALETTES = [
  { tone: 'gold', background: '#FFF3D1', orb: '#FBE3A4', sun: '#F7C9B8' },
  { tone: 'lavender', background: '#F1E9FA', orb: '#E0D0F2', sun: '#CFE6D2' },
  { tone: 'green', background: '#EAF3EB', orb: '#D3E8D5', sun: '#FFE9A8' },
  { tone: 'blue', background: '#E6EEF8', orb: '#CFDDEF', sun: '#FBE3A4' },
  { tone: 'peach', background: '#FDEBE4', orb: '#F7D3C6', sun: '#E6B300' },
];

export function centreArt(index) {
  return PALETTES[((index % PALETTES.length) + PALETTES.length) % PALETTES.length];
}

/** Stable palette for a centre id/slug so it looks the same on every page. */
export function centreArtFor(key) {
  let hash = 0;
  for (const char of String(key)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}
