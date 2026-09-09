import { ArrowRight, MapPin } from 'lucide-react';

const communities = [
  'Charlotte', 'Matthews', 'Mint Hill', 'Weddington', 'Waxhaw',
  'Pineville', 'Huntersville', 'Concord', 'Indian Trail', 'Fort Mill',
];

export default function ServiceArea() {
  return (
    <section id="service-area" aria-labelledby="service-area-heading" className="scroll-mt-24 bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-brand-teal font-bold uppercase tracking-widest text-xs mb-5">
            <MapPin className="w-4 h-4" aria-hidden="true" /> Service Area
          </span>
          <h2 id="service-area-heading" className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Proudly serving <span className="text-brand-teal italic">Charlotte</span> &amp; surrounding areas.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mt-6">
            Bring a fresh look to your kitchen with local backsplash installation.
            Based in Weddington, we work with homeowners throughout the greater Charlotte area, including nearby communities in North and South Carolina.
          </p>
          <ul aria-label="Communities we serve" className="flex flex-wrap gap-2 mt-7">
            {communities.map((community) => (
              <li key={community} className="rounded-full border border-brand-teal/10 bg-brand-teal/5 px-4 py-2 text-sm font-medium text-brand-teal">
                {community}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-500 mt-6">Don't see your town? Enter your ZIP code in our quote request form to check coverage.</p>
          <a href="#estimate" className="inline-flex items-center gap-2 mt-7 bg-brand-teal text-white px-7 py-4 rounded-xl font-bold hover:bg-brand-teal/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
            Request My Personal Quote <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl shadow-slate-200/50">
          <img
            alt="Service-area map highlighting Charlotte and surrounding communities, including Concord, Huntersville, Matthews, Weddington, Waxhaw, and Fort Mill."
            src="/assets/charlotte-service-area.png"
            width="935"
            height="750"
            loading="lazy"
            decoding="async"
            className="block w-full h-auto"
          />
          <div className="p-5 flex items-start gap-3 bg-brand-teal text-white">
            <MapPin className="w-5 h-5 text-brand-gold-light shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold">Your local backsplash specialists</p>
              <p className="text-sm text-white/80 mt-1">Charlotte, NC &amp; surrounding communities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
