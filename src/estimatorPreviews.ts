export const PREVIEW_COLORS = [
  { id: 'warm-white', label: 'Warm white', hex: '#f2eee6' },
  { id: 'ivory', label: 'Ivory', hex: '#e4d6b8' },
  { id: 'greige', label: 'Greige', hex: '#b6ada0' },
  { id: 'sage', label: 'Sage', hex: '#8b9e89' },
  { id: 'slate-blue', label: 'Slate blue', hex: '#526b80' },
  { id: 'charcoal', label: 'Charcoal', hex: '#373d40' },
] as const;

export const PREVIEW_PATTERNS: Record<string, string> = {
  'Running bond': 'running-bond', 'Stacked horizontal': 'stacked-horizontal',
  'Stacked vertical': 'stacked-vertical', Herringbone: 'herringbone', 'Stacked offset': 'stacked-offset',
};

export function previewImagePath(material: string, pattern: string, color: string) {
  const materialId = ['Ceramic', 'Glass', 'Zellige'].includes(material) ? material.toLowerCase() : 'ceramic';
  const patternId = PREVIEW_PATTERNS[pattern] || 'running-bond';
  const colorId = PREVIEW_COLORS.find(item => item.id === color)?.id || 'warm-white';
  return `/assets/estimator-previews/${materialId}-${patternId}-${colorId}.webp`;
}
