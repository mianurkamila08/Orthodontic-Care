export const ARCHWIRE_MATERIALS = [
  "NiTi (Nickel-Titanium)",
  "Thermal / Heat-Activated NiTi",
  "Stainless Steel (SS)",
  "TMA (Beta-Titanium)",
  "CoCr (Elgiloy)",
  "Estetik / Coated NiTi",
] as const;

export const ARCHWIRE_SIZES = [
  { group: "Round (Bulat)", options: ['0.012"', '0.014"', '0.016"', '0.018"', '0.020"'] },
  {
    group: "Rectangular (Persegi)",
    options: [
      '0.016" x 0.022"',
      '0.017" x 0.025"',
      '0.018" x 0.025"',
      '0.019" x 0.025"',
      '0.021" x 0.025"',
    ],
  },
] as const;

export const ARCHWIRE_QUICK_PRESETS = [
  { label: '0.012" NiTi (Awal)', material: "NiTi (Nickel-Titanium)", size: '0.012"' },
  { label: '0.014" NiTi', material: "NiTi (Nickel-Titanium)", size: '0.014"' },
  { label: '0.016" NiTi', material: "NiTi (Nickel-Titanium)", size: '0.016"' },
  { label: '0.016"x0.022" NiTi', material: "NiTi (Nickel-Titanium)", size: '0.016" x 0.022"' },
  { label: '0.017"x0.025" SS', material: "Stainless Steel (SS)", size: '0.017" x 0.025"' },
  { label: '0.019"x0.025" SS', material: "Stainless Steel (SS)", size: '0.019" x 0.025"' },
] as const;

export interface ArchwireChangeState {
  enabled: boolean;
  upperArch: boolean;
  lowerArch: boolean;
  material: string;
  upperSize: string;
  lowerSize: string;
}

export const formatArchwireSummary = (wire: ArchwireChangeState): string => {
  if (!wire.enabled) return "";
  const parts: string[] = [];
  if (wire.upperArch && wire.upperSize) {
    parts.push(`RA ${wire.upperSize}`);
  }
  if (wire.lowerArch && wire.lowerSize) {
    parts.push(`RB ${wire.lowerSize}`);
  }
  if (parts.length === 0) return `Archwire change (${wire.material})`;
  return `Archwire change: ${parts.join(" & ")} (${wire.material})`;
};
