import { ArrowUpRight, ShieldCheck, Star } from 'lucide-react';

const thumbtackUrl = 'https://www.thumbtack.com/nc/matthews/remodeling-contractors/vad-constructions/service/495462164766130192';
const bbbUrl = 'https://www.bbb.org/us/nc/weddington/profile/bathroom-remodel/vad-constructions-0473-92033654';
const googleUrl = 'https://g.co/kgs/7Uc7n9J';

// Reuse VAD's provider widget in an isolated document so its styles and script
// cannot overwrite the React page. The profile link remains available if blocked.
const thumbtackWidget = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
body{margin:0;font:14px system-ui,sans-serif;text-align:center;color:#334155}a{color:#005b71}img.tt-logo{width:130px;height:28px;margin:12px auto}#tt-dynamic img{width:20px;height:20px}.widget{margin:auto!important;max-width:100%!important}
</style></head><body><div class="widget" id="tt-review-widget-star">
<img src="https://cdn.thumbtackstatic.com/fe-assets-web/media/logos/thumbtack/wordmark.svg" alt="Thumbtack" class="tt-logo">
<a target="_blank" rel="noopener noreferrer" href="${thumbtackUrl}"><div>VAD Constructions</div></a>
<div id="tt-dynamic"></div>
<script src="https://www.thumbtack.com/profile/widgets/scripts/?service_pk=495462164766130192&widget_id=review&type=star"></script>
</div></body></html>`;

const linkClass = 'mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-brand-teal hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal transition-colors';

export default function Reviews() {
  return (
    <section id="reviews" data-analytics-section="reviews" aria-labelledby="reviews-heading" className="bg-white py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-4">The team behind your backsplash</p>
          <h2 id="reviews-heading" className="text-4xl font-bold text-slate-900 mb-5">Our reputation. Your peace of mind.</h2>
          <p className="text-slate-600 leading-relaxed">
            Queen City Backsplash is the backsplash division of{' '}
            <a href="https://vadconstructions.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-teal underline underline-offset-4">VAD Constructions</a>.
            {' '}Our customer reviews and BBB accreditation are listed under VAD Constructions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="flex flex-col rounded-3xl border border-slate-200 p-7 text-center">
            <h3 className="text-xl font-bold mb-2">Thumbtack reviews</h3>
            <p className="text-sm text-slate-500 mb-5">Meet our customers. Hear their experiences.</p>
            <iframe title="VAD Constructions Thumbtack ratings" srcDoc={thumbtackWidget} sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" loading="lazy" className="w-full h-44 border-0 mb-6" />
            <a href={thumbtackUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Read Thumbtack reviews <ArrowUpRight aria-hidden="true" className="w-4 h-4" /></a>
          </article>

          <article className="flex flex-col rounded-3xl border border-brand-teal/20 bg-brand-teal/5 p-7 text-center">
            <h3 className="text-xl font-bold mb-2">BBB Accredited</h3>
            <p className="text-sm text-slate-500 mb-5">VAD Constructions</p>
            <div className="min-h-44 flex flex-col items-center justify-center mb-6">
              <ShieldCheck aria-hidden="true" className="w-10 h-10 text-brand-teal mb-3" />
              <span className="text-5xl font-bold text-brand-teal">A+</span>
              <span className="text-sm font-medium text-slate-600 mt-2">BBB rating</span>
            </div>
            <a href={bbbUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>View BBB accreditation <ArrowUpRight aria-hidden="true" className="w-4 h-4" /></a>
          </article>

          <article className="flex flex-col rounded-3xl border border-slate-200 p-7 text-center">
            <h3 className="text-xl font-bold mb-2">Google reviews</h3>
            <p className="text-sm text-slate-500 mb-5">Real projects. Feedback from our customers.</p>
            <div className="min-h-44 flex flex-col items-center justify-center mb-6">
              <Star aria-hidden="true" className="w-10 h-10 text-brand-gold mb-4" />
              <span className="text-xl font-semibold text-slate-900">VAD Constructions</span>
              <p className="text-sm text-slate-500 mt-2 max-w-56">See our latest ratings and customer reviews on Google.</p>
            </div>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Read Google reviews <ArrowUpRight aria-hidden="true" className="w-4 h-4" /></a>
          </article>
        </div>
      </div>
    </section>
  );
}
