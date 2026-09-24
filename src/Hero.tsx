import { ArrowRight, ShieldCheck } from 'lucide-react';
import { RESPONSE_TIME } from './contact';
import { THUMBTACK_PROFILE } from './CompletedProjects';
import { trackQuoteCtaClick } from './analytics';

export default function Hero() {
  return (
    <section className="pt-22 md:pt-36 pb-12 md:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-14 lg:gap-y-0 lg:items-center">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-2 sm:mb-4">Charlotte & surrounding communities</p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-3 sm:mb-5">Kitchen Backsplash Installation in <span className="text-brand-teal">Charlotte, NC</span></h1>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <a href="/cost-estimator/" className="inline-flex items-center justify-center gap-2 bg-brand-teal text-white rounded-xl px-5 py-3 sm:px-6 sm:py-4 font-bold hover:bg-brand-teal/90">Estimate My Cost <ArrowRight className="w-5 h-5" /></a>
            <a href="#estimate" onClick={() => trackQuoteCtaClick('hero')} className="inline-flex items-center justify-center gap-2 border border-brand-teal text-brand-teal rounded-xl px-5 py-3 sm:px-6 sm:py-4 font-bold">Request a Personal Quote</a>
          </div>
        </div>
        <figure className="overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <img src="/assets/kannapolis-backsplash.jpg" width="960" height="1280" fetchPriority="high" alt="VAD Constructions backsplash installation in Kannapolis with blue-gray tile, gray cabinets, and white countertops" className="w-full h-48 sm:h-[440px] lg:h-[600px] object-cover object-center" />
          <figcaption className="px-4 py-3 sm:px-5 sm:py-4 bg-slate-50"><span className="block font-semibold text-slate-900">Completed project · Kannapolis, NC</span><span className="block text-sm text-slate-600 mt-1">Countertop-to-ceiling backsplash · Custom tile installation by VAD Constructions</span></figcaption>
        </figure>
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-5">
          <p className="text-sm text-slate-500 mb-5">A backsplash division of <a href="https://vadconstructions.com/" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">VAD Constructions</a></p>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">A fresh look for the kitchen you love. Tell us where your project is, and we’ll help with measurements, tile choices, and a personal installation quote.</p>
          <p className="text-sm text-slate-500">{RESPONSE_TIME}</p>
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
