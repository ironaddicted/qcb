import { ArrowUpRight } from 'lucide-react';

export const THUMBTACK_PROFILE = 'https://www.thumbtack.com/nc/matthews/remodeling-contractors/vad-constructions/service/495462164766130192#ServicePageReviewsSection';

const projects = [
  {
    title: 'Gray subway kitchen backsplash',
    image: '/assets/completed-rock-hill-kitchen.png',
    alt: 'Completed Rock Hill kitchen with gray subway backsplash, dark wood cabinets, and light countertops',
    detailImage: '/assets/completed-rock-hill-detail.png',
    detailAlt: 'Close-up of gray subway backsplash with light grout and under-cabinet lighting in Rock Hill',
    scope: 'Rock Hill, SC · Kitchen backsplash',
    attribution: 'Completed by VAD Constructions',
    source: 'https://vadconstructions.com/',
    sourceLabel: 'Visit VAD Constructions',
  },
  {
    title: 'White subway with dark grout',
    image: '/assets/completed-matthews-white-subway.png',
    alt: 'Completed white subway tile backsplash with dark grout above black countertops in a Matthews kitchen',
    scope: 'Matthews, NC · Kitchen backsplash',
    attribution: 'Completed by VAD Constructions',
    source: 'https://vadconstructions.com/',
    sourceLabel: 'Visit VAD Constructions',
  },
  {
    title: 'Window-surround backsplash',
    image: '/assets/completed-charlotte-window-backsplash.png',
    alt: 'Completed light tile backsplash surrounding a kitchen window, with gray cabinets and white countertops in Charlotte',
    scope: 'Charlotte, NC · Kitchen backsplash',
    attribution: 'Completed by VAD Constructions',
    source: 'https://vadconstructions.com/',
    sourceLabel: 'Visit VAD Constructions',
  },
  {
    title: 'Green square tile backsplash',
    image: '/assets/completed-charlotte-backsplash.png',
    alt: 'Completed green square tile backsplash beneath white cabinets and above a patterned stone countertop in Charlotte',
    scope: 'Charlotte, NC · Kitchen backsplash',
    attribution: 'Completed by VAD Constructions',
    source: 'https://vadconstructions.com/',
    sourceLabel: 'Visit VAD Constructions',
  },
  {
    title: 'Blue-gray subway backsplash',
    image: '/assets/completed-matthews-backsplash.png',
    alt: 'Blue-gray subway tile backsplash above a patterned stone countertop in a completed Matthews kitchen',
    scope: 'Matthews, NC · Kitchen backsplash',
    attribution: 'Completed by VAD Constructions',
    source: THUMBTACK_PROFILE.replace('#ServicePageReviewsSection', '#ServicePageMediaSection'),
    sourceLabel: 'View VAD projects on Thumbtack',
  },
  {
    title: 'White ceramic backsplash',
    image: '/assets/completed-white-ceramic.jpg',
    alt: 'Completed white ceramic subway backsplash behind a kitchen sink and white cabinets',
    scope: 'Ceramic tile · Kitchen backsplash',
    attribution: 'Customer photo · Julie H. · April 2026',
    source: THUMBTACK_PROFILE,
    sourceLabel: 'View customer review on Thumbtack',
  },
  {
    title: 'Gray porcelain backsplash',
    image: '/assets/completed-gray-porcelain.jpg',
    alt: 'Completed gray porcelain backsplash behind a cooktop with gray cabinets and white countertops',
    scope: 'Porcelain tile · Kitchen backsplash',
    attribution: 'Customer photo · Azat S. · July 2025',
    source: THUMBTACK_PROFILE,
    sourceLabel: 'View customer review on Thumbtack',
  },
  {
    title: 'Countertop-to-ceiling tile',
    image: '/assets/kannapolis-backsplash.jpg',
    alt: 'Completed blue-gray tile backsplash extending to the ceiling in a Kannapolis kitchen',
    scope: 'Kannapolis, NC · Custom tile installation',
    attribution: 'From the VAD Constructions project portfolio',
    source: 'https://vadconstructions.com/',
    sourceLabel: 'View VAD Constructions portfolio',
  },
];

export default function CompletedProjects() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-20">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-3">Installed by VAD Constructions</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Completed backsplash projects</h2>
      <p className="text-slate-600 max-w-2xl mb-8">A closer look at our finished work, including photos shared by customers on Thumbtack.</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <article key={project.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white flex flex-col">
            <a href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full photo: ${project.title}`} className="block bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-teal focus-visible:outline-offset-[-2px]">
              <img src={project.image} alt={project.alt} loading="lazy" decoding="async" className="w-full h-72 object-contain" />
            </a>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-slate-600">{project.scope}</p>
              {project.detailImage && (
                <a href={project.detailImage} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-brand-teal underline underline-offset-4">
                  <img src={project.detailImage} alt={project.detailAlt} loading="lazy" decoding="async" width="80" height="60" className="w-20 h-15 rounded-md object-contain bg-slate-50" />
                  View backsplash detail
                </a>
              )}
              <p className="text-xs text-slate-500 mt-3 mb-5">{project.attribution}</p>
              <a href={project.source} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-teal underline underline-offset-4">{project.sourceLabel}<ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
