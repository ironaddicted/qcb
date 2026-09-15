import { ArrowUpRight, Quote } from 'lucide-react';
import { THUMBTACK_PROFILE } from './CompletedProjects';

// Exact short excerpts displayed on https://vadconstructions.com/, checked
// September 15, 2026. Keep the original attribution and link to the full reviews.
const reviews = [
  { name: 'Julie H.', project: 'Backsplash installation', excerpt: 'very precise, detail-oriented' },
  { name: 'Azat s.', project: 'Porcelain backsplash', excerpt: 'professional, knowledgeable and punctual' },
  { name: 'Jill H.', project: 'Bathroom makeover', excerpt: 'professional and courteous throughout the project' },
  { name: 'Franklin Y.', project: 'Master bathroom renovation', excerpt: 'We appreciate his communication and frequent updates.' },
];

export default function CustomerReviews() {
  return (
    <section id="customer-reviews" data-analytics-section="customer_reviews" aria-labelledby="customer-reviews-heading" className="py-16 md:py-24 bg-brand-teal/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mb-8 md:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-3">From our clients</p>
          <h2 id="customer-reviews-heading" className="text-3xl md:text-4xl font-bold mb-4">Real customer reviews</h2>
          <p className="text-slate-600">Selected excerpts from Thumbtack reviews for VAD Constructions, the team behind Queen City Backsplash.</p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {reviews.map(review => (
            <figure key={review.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <Quote className="w-7 h-7 text-brand-gold mb-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal mb-3">{review.project}</p>
              <blockquote className="text-xl text-slate-900 leading-relaxed mb-6">“{review.excerpt}”</blockquote>
              <figcaption className="mt-auto">
                <span className="block font-semibold mb-2">{review.name}</span>
                <a href={THUMBTACK_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal underline underline-offset-4">Read full review on Thumbtack <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" /></a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
