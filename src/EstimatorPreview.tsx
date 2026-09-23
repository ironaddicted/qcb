import { useState } from 'react';
import { PREVIEW_COLORS, previewImagePath } from './estimatorPreviews';

interface Props {
  material: string;
  pattern: string;
  color: string;
  onColorChange: (value: string) => void;
}

export default function EstimatorPreview({ material, pattern, color, onColorChange }: Props) {
  const src = previewImagePath(material, pattern, color);
  const [loadedSrc, setLoadedSrc] = useState('');
  const [failedSrc, setFailedSrc] = useState('');
  const shade = PREVIEW_COLORS.find(item => item.id === color) || PREVIEW_COLORS[0];
  const displayMaterial = ['Ceramic', 'Glass', 'Zellige'].includes(material) ? material : 'Ceramic';
  const displayPattern = pattern || 'Running bond';
  return <aside className="est-sidebar est-photo-sidebar" aria-label="Backsplash preview">
    <span className="est-eyebrow">EXPLORE YOUR LOOK</span>
    <h2>Your kitchen, your style.</h2>
    <div className="est-photo-frame" aria-busy={loadedSrc !== src && failedSrc !== src}>
      <img key={src} src={src} alt={`${shade.label} ${displayMaterial.toLowerCase()} backsplash in a ${displayPattern.toLowerCase()} pattern`} onLoad={() => setLoadedSrc(src)} onError={() => setFailedSrc(src)} style={{ opacity: loadedSrc === src ? 1 : 0 }} />
      {loadedSrc !== src && <span className="est-photo-status" role="status">{failedSrc === src ? 'Preview unavailable. Your selections are saved.' : 'Loading your look…'}</span>}
    </div>
    <p className="est-preview-caption" aria-live="polite">{displayMaterial} · {displayPattern} · {shade.label}</p>
    <label className="est-color-label" htmlFor="est-preview-color">Tile color <span>Change at any step</span></label>
    <select id="est-preview-color" value={color} onChange={event => onColorChange(event.target.value)}>{PREVIEW_COLORS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
    <div className="est-color-swatches" role="group" aria-label="Tile colors">{PREVIEW_COLORS.map(item => <button key={item.id} type="button" style={{ backgroundColor: item.hex }} aria-label={item.label} title={item.label} aria-pressed={color === item.id} onClick={() => onColorChange(item.id)}><span>{color === item.id ? '✓' : ''}</span></button>)}</div>
    <small>{material === 'Other' ? 'Ceramic shown as a reference for your custom material.' : !material || !pattern ? 'Showing a sample until you choose your tile and pattern.' : 'AI-generated design preview.'} Colors and texture are illustrative; confirm your finish with a physical tile sample. Color does not change this estimate.</small>
  </aside>;
}
