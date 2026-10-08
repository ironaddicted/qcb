import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { CALL_URL, PHONE_LABEL, RESPONSE_TIME } from './contact';
import { THUMBTACK_PROFILE } from './CompletedProjects';
import { trackContactClick, trackQuoteCtaClick } from './analytics';

export default function Hero() {
  return (
    <section className="pt-22 md:pt-36 pb-12 md:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-14 lg:gap-y-0 lg:items-center">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-2 sm:mb-4">Charlotte & surrounding communities</p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-3 sm:mb-5">Kitchen Backsplash Installation in <span className="text-brand-teal">Charlotte, NC</span></h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-5">Tile backsplash installation for Charlotte-area kitchens, from classic subway tile to herringbone and zellige. We help with measurements and tile choices, protect your countertops and cabinets, and handle installation, grout, and finishing.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <a href="#estimate" onClick={() => trackQuoteCtaClick('hero')} className="inline-flex items-center justify-center gap-2 bg-brand-teal text-white rounded-xl px-5 py-3 sm:px-6 sm:py-4 font-bold hover:bg-brand-teal/90">Request a Free Quote <ArrowRight className="w-5 h-5" aria-hidden="true" /></a>
            <a href={CALL_URL} onClick={() => trackContactClick('call', 'hero', CALL_URL)} className="inline-flex items-center justify-center gap-2 border border-brand-teal text-brand-teal rounded-xl px-5 py-3 sm:px-6 sm:py-4 font-bold"><Phone className="w-5 h-5" aria-hidden="true" />Call {PHONE_LABEL}</a>
          </div>
          <p className="text-sm text-slate-600 mt-3">No measurements needed to request a quote. {RESPONSE_TIME}</p>
          <a href="/cost-estimator/" data-estimator-entry="hero" className="inline-flex items-center gap-2 min-h-11 mt-2 text-sm font-semibold text-brand-teal underline underline-offset-4">Explore tile styles &amp; estimate my cost <ArrowRight className="w-4 h-4" aria-hidden="true" /></a>
        </div>
        <figure className="overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <img src="/assets/kannapolis-backsplash.webp" width="960" height="1280" fetchPriority="high" alt="VAD Constructions backsplash installation in Kannapolis with blue-gray tile, gray cabinets, and white countertops" className="w-full h-48 sm:h-[440px] lg:h-[600px] object-cover object-center" />
          <figcaption className="px-4 py-3 sm:px-5 sm:py-4 bg-slate-50"><span className="block font-semibold text-slate-900">Completed project · Kannapolis, NC</span><span className="block text-sm text-slate-600 mt-1">Countertop-to-ceiling backsplash · Custom tile installation by VAD Constructions</span></figcaption>
        </figure>
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-5">
          <p className="text-sm text-slate-500 mb-5">A backsplash division of <a href="https://vadconstructions.com/" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">VAD Constructions</a></p>
          <figure className="border-l-2 border-brand-gold pl-4 mt-7">
            <blockquote className="text-slate-700 italic">“He did an amazing job on my kitchen backsplash!”</blockquote>
            <figcaption className="text-xs text-slate-500 mt-2">Julie H. · VAD Constructions backsplash customer · April 2026 · <a href={THUMBTACK_PROFILE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Read on Thumbtack</a></figcaption>
          </figure>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-teal mt-6"><ShieldCheck className="w-5 h-5" /> Fully insured · VAD Constructions is BBB Accredited</p>
        </div>
      </div>
    </section>
  );
}

