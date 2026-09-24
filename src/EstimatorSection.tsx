import { ArrowRight, Calculator } from 'lucide-react';

export default function EstimatorSection() {
  return <section id="cost-estimator" className="bg-slate-50 py-12 md:py-20" aria-labelledby="estimator-section-heading">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
      <img src="/assets/estimator-previews/zellige-herringbone-sage.webp" width="640" height="640" loading="lazy" alt="Illustrative sage zellige herringbone backsplash from the cost estimator" className="w-full max-h-80 object-cover rounded-3xl" />
      <div><p className="text-brand-teal text-xs font-bold uppercase tracking-widest mb-3">Plan your backsplash</p>
        <h2 id="estimator-section-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4">See your tile. Know your budget.</h2>
        <p className="text-slate-600 leading-relaxed mb-5">Choose your pattern, material, and color. Preview your look and get a labor price plus a separate materials allowance. Then send your design to us for a personal quote.</p>
        <p className="text-sm text-slate-500 mb-6">Four simple steps · No contact details needed to see your estimate</p>
        <a href="/cost-estimator/" className="flex sm:inline-flex justify-center items-center gap-3 rounded-xl bg-brand-teal text-white px-6 py-4 font-bold"><Calculator size={20} />Estimate My Cost<ArrowRight size={20} /></a>
      </div>
    </div>
  </section>;
}
