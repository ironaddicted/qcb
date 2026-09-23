export const DEMOLITION_AND_DRYWALL_PER_SQ_FT = 11;
export const DEMOLITION_MINIMUM = 350;
export const INSTALLATION_MINIMUMS: Record<string, number> = { Ceramic: 700, Glass: 850, Zellige: 1000 };

// Planning allowances, not supplier quotes. See ESTIMATOR-ALLOWANCES.md.
export const MATERIAL_BUDGETS: Record<string, { tile: number; settingPack: number; coverage: number }> = {
  Ceramic: { tile: 6, settingPack: 35, coverage: 25 },
  Glass: { tile: 18, settingPack: 45, coverage: 25 },
  Zellige: { tile: 22, settingPack: 40, coverage: 25 },
};
export const PATTERN_WASTE: Record<string, number> = {
  'Running bond': 0.1, 'Stacked horizontal': 0.1, 'Stacked vertical': 0.1,
  'Stacked offset': 0.15, Herringbone: 0.2,
};

export function calculateMaterials(area: number, pattern: string, material: string) {
  if (!Number.isFinite(area) || area <= 0) throw new Error('A positive area is required.');
  const budget = MATERIAL_BUDGETS[material];
  const patternWaste = PATTERN_WASTE[pattern];
  if (!budget || patternWaste === undefined) return null;
  const waste = patternWaste + (material === 'Zellige' ? 0.05 : 0);
  const tileArea = Math.ceil(area * (1 + waste) * 100 - 1e-9) / 100;
  const tile = Math.round(tileArea * budget.tile * 100) / 100;
  // Whole packs for installed area: offcuts do not consume adhesive.
  const setting = Math.ceil(area / budget.coverage) * budget.settingPack;
  const protection = 35 + Math.ceil(area / 50) * 15;
  // Budget one outlet kit per four linear feet at standard 19-inch height.
  const outlets = Math.max(1, Math.ceil((area * 12 / 19) / 4));
  const electrical = outlets * 6;
  const total = Math.round((tile + setting + protection + electrical) * 100) / 100;
  return { waste, tileArea, tile, setting, protection, outlets, electrical, total };
}

// Installation midpoints supplied by the business, in dollars per square foot.
export const INSTALLATION_RATES: Record<string, Record<string, number>> = {
  'Running bond': { Ceramic: 21.5, Glass: 30, Zellige: 37.5 },
  'Stacked horizontal': { Ceramic: 21.5, Glass: 30, Zellige: 37.5 },
  'Stacked vertical': { Ceramic: 24, Glass: 32.5, Zellige: 40 },
  'Stacked offset': { Ceramic: 26, Glass: 34, Zellige: 42.5 },
  Herringbone: { Ceramic: 34, Glass: 46.5, Zellige: 55 },
};

export function calculateEstimate(area: number, pattern: string, material: string, demolition: boolean) {
  if (!Number.isFinite(area) || area <= 0) throw new Error('A positive area is required.');
  const rate = INSTALLATION_RATES[pattern]?.[material] ?? null;
  const minimum = rate === null ? null : INSTALLATION_MINIMUMS[material] * (pattern === 'Herringbone' ? 1.35 : 1);
  const preparation = demolition ? Math.max(area * DEMOLITION_AND_DRYWALL_PER_SQ_FT, DEMOLITION_MINIMUM) : 0;
  const installation = rate === null || minimum === null ? null : Math.max(area * rate, minimum);
  const total = installation === null ? null : installation + preparation;
  const materials = calculateMaterials(area, pattern, material);
  const projectTotal = total === null || materials === null ? null : Math.round((total + materials.total) * 100) / 100;
  return { rate, minimum, preparation, installation, total, materials, projectTotal };
}
