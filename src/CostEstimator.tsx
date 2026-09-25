import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Crown, Hammer, Ruler, PanelsTopLeft, Square, Sparkles } from 'lucide-react';
import './estimator.css';
import EstimatorPreview from './EstimatorPreview';
import InquiryForm from './InquiryForm';
import { useEstimatorAnalytics } from './useEstimatorAnalytics';
import type { BacksplashConfiguration } from './inquiry';
import { PREVIEW_COLORS, previewImagePath } from './estimatorPreviews';
import { calculateEstimate } from './estimatorPricing';

const patterns = ['Running bond', 'Stacked horizontal', 'Stacked vertical', 'Herringbone', 'Stacked offset'] as const;
const materials = ['Ceramic', 'Zellige', 'Glass', 'Other'] as const;
const steps = ['Preparation', 'Pattern', 'Material', 'Measurements'];

const money = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

function PatternPreview({ pattern }: { pattern: string }) {
  const tiles = [];
  if (pattern === 'Herringbone') {
    for (let row = -5; row < 8; row++) for (let col = -5; col < 8; col++) {
      const x = col * 60 + row * 20;
      const y = row * 20 - col * 60;
      tiles.push(<rect key={`${row}-${col}-a`} x={x} y={y} width="38" height="18" rx="1" />);
      tiles.push(<rect key={`${row}-${col}-b`} x={x + 40} y={y} width="18" height="38" rx="1" />);
    }
    return <svg viewBox="0 0 200 116" aria-hidden="true"><g transform="translate(100 -60) rotate(45)" fill="currentColor">{tiles}</g></svg>;
  }
  const vertical = pattern === 'Stacked vertical' || pattern === 'Stacked offset';
  const w = vertical ? 23 : 55;
  const h = vertical ? 53 : 25;
  for (let row = -1; row < 6; row++) for (let col = -1; col < 10; col++) {
    const offset = (pattern === 'Running bond' || pattern === 'Stacked offset') && Math.abs(row % 2) === 1 ? (w + 4) / 2 : 0;
    tiles.push(<rect key={`${row}-${col}`} x={col * (w + 4) + offset} y={row * (h + 4)} width={w} height={h} rx="1.5" />);
  }
  return <svg viewBox="0 0 200 116" aria-hidden="true"><g fill="currentColor">{tiles}</g></svg>;
}

export default function CostEstimator() {
  const [step, setStep] = useState(0);
  const [demolition, setDemolition] = useState<boolean | null>(null);
  const [pattern, setPattern] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('warm-white');
  const colorLabel = PREVIEW_COLORS.find(item => item.id === color)?.label || 'Warm white';
  const [method, setMethod] = useState<'measure' | 'cabinets' | 'area'>('measure');

  const [length, setLength] = useState('');
  const height = 19;
  const [directArea, setDirectArea] = useState('');
  const [cabinets, setCabinets] = useState('');
  const cabinetWidth = 26;
  const [complete, setComplete] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { document.title = 'Backsplash Cost Estimator | Queen City Backsplash'; }, []);
  useEffect(() => { heading.current?.focus(); }, [step, complete]);
  const positive = (value: string) => Number.isFinite(Number(value)) && Number(value) > 0;
  const area = method === 'cabinets' ? Number(cabinets) * Number(cabinetWidth) * Number(height) / 144
    : method === 'area' ? Number(directArea) : Number(length) * Number(height) / 12;
  const validSize = method === 'cabinets'
    ? positive(cabinets) && Number.isInteger(Number(cabinets))
    : method === 'area' ? positive(directArea) : positive(length);
  const analytics = useEstimatorAnalytics({ step: complete ? 4 : step, demolition, pattern, material, color, method, area: validSize && Number.isFinite(area) ? area : null });
  const canContinue = [demolition !== null, Boolean(pattern), Boolean(material), validSize && Number.isFinite(area)][step];
  const areaLabel = area.toLocaleString('en-US', { maximumFractionDigits: 1 });
  const estimate = validSize && Number.isFinite(area) && area > 0 ? calculateEstimate(area, pattern, material, demolition === true) : null;
  const configuration: BacksplashConfiguration | undefined = complete && estimate ? {
    version: 1, demolition: demolition === true, pattern, material, color, colorLabel,
    previewImage: previewImagePath(material, pattern, color),
    measurement: {
      method, areaSqFt: area,
      lengthFeet: method === 'measure' ? Number(length) : null,
      cabinetCount: method === 'cabinets' ? Number(cabinets) : null,
      assumedCabinetWidthInches: method === 'cabinets' ? cabinetWidth : null,
      assumedHeightInches: method === 'area' ? null : height,
    },
    pricing: {
      currency: 'USD', installationLabor: estimate.installation,
      demolitionAndDrywallLabor: estimate.preparation, totalLabor: estimate.total,
      materialsAllowance: estimate.materials?.total ?? null, planningTotal: estimate.projectTotal,
      materialsAllowanceIsEstimate: true,
    },
  } : undefined;
  const field = (label: string, value: string, update: (value: string) => void, unit: string, whole = false) => <label className="est-field"><span>{label}</span><div><input type="number" min={whole ? '1' : '0.1'} step={whole ? '1' : 'any'} value={value} onChange={event => update(event.target.value)} placeholder="0" /><span>{unit}</span></div></label>;
  return <div className="est-page">
    <header className="est-header"><a href="/" className="est-brand"><Crown size={29} /><span>QUEEN CITY<small>BACKSPLASH</small></span></a><a href="/" className="est-home"><ArrowLeft size={16} /> Back to website</a></header>
    <main className="est-main">
      <div className="est-intro"><span className="est-eyebrow">YOUR KITCHEN, REIMAGINED</span><h1>Let’s plan your backsplash.</h1><p>A few simple details. A clearer picture of your project.</p></div>
      <div className="est-layout"><section className="est-card">
        <ol className="est-progress" aria-label="Estimator progress">{steps.map((label, i) => <li key={label} aria-current={!complete && step === i ? 'step' : undefined} className={complete || i <= step ? 'active' : ''}><span>{complete || i < step ? <Check size={15} /> : i + 1}</span><small>{label}</small></li>)}</ol>
        <div className="est-content">
          <p className="est-eyebrow">{complete ? 'YOUR PROJECT AT A GLANCE' : `STEP ${step + 1} OF 4`}</p>
          <h2 ref={heading} tabIndex={-1}>{complete ? 'Your backsplash plan is ready.' : ['Do you have a backsplash to remove?', 'Which pattern feels like you?', 'What tile material are you planning?', 'How big is your backsplash?'][step]}</h2>
          <p className="est-description">{complete ? 'Review your choices below and send your project details for a personal quote.' : ['Tell us if your current backsplash needs demolition before we install the new one.', 'Choose a layout below. Each preview shows how your tiles will be arranged.', 'Choose your preferred tile. Still exploring? Select Other.', 'Enter your backsplash length, count your cabinets, or use your exact square footage.'][step]}</p>
          {!complete && step === 0 && <div className="est-options two">{[true, false].map(value => <button key={String(value)} className={`est-option ${demolition === value ? 'selected' : ''}`} aria-pressed={demolition === value} onClick={() => setDemolition(value)}>{value ? <Hammer /> : <Sparkles />}<strong>{value ? 'Yes, remove it' : 'No removal needed'}</strong><span>{value ? 'Remove backsplash & install new drywall. $350 minimum.' : 'My wall is ready for a new look.'}</span><i>{demolition === value && <Check size={13} />}</i></button>)}</div>}
          {!complete && step === 1 && <div className="est-patterns">{patterns.map(value => <button key={value} className={`est-pattern ${pattern === value ? 'selected' : ''}`} aria-pressed={pattern === value} onClick={() => setPattern(value)}><div><PatternPreview pattern={value} /></div><strong>{value}</strong><i>{pattern === value && <Check size={13} />}</i></button>)}</div>}
          {!complete && step === 2 && <div className="est-options two">{materials.map((value, i) => <button key={value} className={`est-option ${material === value ? 'selected' : ''}`} aria-pressed={material === value} onClick={() => setMaterial(value)}><div className={`est-swatch swatch-${i}`} /><strong>{value}</strong><span>{['Classic, smooth & versatile', 'Handcrafted texture & character', 'Luminous & reflective', 'Another material or still deciding'][i]}</span><i>{material === value && <Check size={13} />}</i></button>)}</div>}
          {!complete && step === 3 && <>
            <div className="est-options est-methods">{(['measure', 'cabinets', 'area'] as const).map(value => <button key={value} className={`est-option ${method === value ? 'selected' : ''}`} aria-pressed={method === value} onClick={() => setMethod(value)}>{value === 'measure' ? <Ruler /> : value === 'cabinets' ? <PanelsTopLeft /> : <Square />}<strong>{value === 'measure' ? 'I know the length' : value === 'cabinets' ? 'Count my cabinets' : 'I know the square footage'}</strong><i>{method === value && <Check size={13} />}</i></button>)}</div>
            <div className="est-fields">{method === 'cabinets' ? <>{field('Number of cabinets', cabinets, setCabinets, 'cabinets', true)}</> : method === 'area' ? field('Total backsplash area', directArea, setDirectArea, 'sq ft') : <>{field('Total backsplash length', length, setLength, 'feet')}</>}</div>
            <p className="est-help">{method === 'cabinets' ? 'Count only cabinet sections along the backsplash, excluding islands and tall pantry cabinets. Area is estimated automatically from your cabinet count.' : method === 'measure' ? 'Add the lengths of all backsplash walls together. Area is calculated using a standard backsplash height.' : 'Enter the combined area of all walls receiving backsplash tile.'} For taller sections behind your range, use the total square footage option.</p>
            <div className="est-area" aria-live="polite"><span>Estimated backsplash area</span><strong>{validSize && Number.isFinite(area) ? areaLabel : '—'} <small>sq ft</small></strong></div>
          </>}
          {complete && <><dl className="est-results"><div><dt>Existing backsplash removal</dt><dd>{demolition ? 'Yes' : 'No'}</dd></div><div><dt>Pattern</dt><dd>{pattern}</dd></div><div><dt>Material</dt><dd>{material}</dd></div><div><dt>Color preference</dt><dd>{colorLabel}</dd></div><div><dt>Estimated area</dt><dd>{areaLabel} sq ft</dd></div></dl><div className="est-quote-note"><h3 className="est-cost-heading">Your labor price</h3><div className="est-price-line"><span>Installation, grout &amp; caulk</span><strong>{estimate?.installation != null ? money(estimate.installation) : 'Personal quote'}</strong></div><div className="est-price-line"><span>Demolition &amp; new drywall</span><strong>{money(estimate?.preparation ?? 0)}</strong></div><div className="est-price-total"><span>Total labor</span><strong>{estimate?.total != null ? money(estimate.total) : 'Personal quote'}</strong></div><p>{material === 'Other' ? 'Your chosen material requires a personal labor quote. The preparation amount above is only part of the labor cost.' : 'Labor price for the area, tile type, and pattern you selected. Changes to those details or the project scope may change the labor price.'}</p><p>Minimum project pricing covers preparation, setup, and finishing visits.</p></div><div className="est-quote-note est-material-budget"><h3 className="est-cost-heading">Your estimated materials budget</h3><div className="est-price-total"><span>Materials allowance</span><strong>{estimate?.materials != null ? money(estimate.materials.total) : 'Personal quote'}</strong></div><p><strong>This is a planning allowance, not a fixed material price. Your actual materials cost may be higher or lower depending on the products you choose.</strong></p><p>Includes tile with cutting waste, compatible adhesive or mortar, protective coverings and tape, outlet risers, and long screws. We will confirm the actual material cost once your selections and quantities are finalized.</p><p>Grout, caulk, trim, drywall supplies, tax, delivery, and disposal are not included in this allowance.</p></div><div className="est-budget-combined"><span>Planning total · labor + materials allowance</span><strong>{estimate?.projectTotal != null ? money(estimate.projectTotal) : 'Personal quote'}</strong><p>This combined budget will change with your final material selections.</p></div><InquiryForm configuration={configuration!} onEstimatorEvent={analytics.quote} /></>}
        </div>
        <div className="est-actions"><button className="est-back" disabled={step === 0 && !complete} onClick={() => complete ? setComplete(false) : setStep(step - 1)}><ArrowLeft size={17} />{complete ? 'Edit measurements' : 'Back'}</button>{complete ? <button className="est-back" onClick={() => { setComplete(false); setStep(0); }}>Edit choices</button> : <button className="est-primary" disabled={!canContinue} onClick={() => step < 3 ? setStep(step + 1) : setComplete(true)}>{step === 3 ? 'Review my project' : 'Continue'}<ArrowRight size={18} /></button>}</div>
      </section><EstimatorPreview material={material} pattern={pattern} color={color} onColorChange={setColor} /></div>
      <p className="est-footer">Queen City Backsplash · Thoughtful details. Expert installation.</p>
    </main>
  </div>;
}












