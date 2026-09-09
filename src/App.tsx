/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { observeJourney } from './analytics';
import InquiryForm from './InquiryForm';
import Hero from './Hero';
import CompletedProjects from './CompletedProjects';
import MobileContactBar from './MobileContactBar';
import Reviews from './Reviews';
import ServiceArea from './ServiceArea';
import { motion, AnimatePresence } from 'motion/react';


import { 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
  ClipboardList,
  Hammer,
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';

export { SERVICE_AREA_ZIP_CODES, isZipInServiceArea } from './serviceAreaData';

// --- Constants ---
const GALLERY_SAMPLES = [
  { id: 1, title: 'Vibrant Green Subway', type: 'Ceramic', url: '/assets/green_glass.jpg' },
  { id: 2, title: 'Modern Checkerboard', type: 'Porcelain', url: '/assets/g_combined_white_grey_zellenge.png' },
  { id: 3, title: 'Seamless Quartz Panel', type: 'Quartz', url: '/assets/g_pvc_backsplash.jpg' },
  { id: 4, title: 'Artisan Green Square', type: 'Ceramic', url: '/assets/g_zellige_green.jpg' },
  { id: 5, title: 'Classic White Subway', type: 'Ceramic', url: '/assets/gen_2.png' },
  { id: 6, title: 'Emerald Glass Subway', type: 'Glass', url: '/assets/emerald_sub.png' },
  { id: 7, title: 'Herringbone', type: 'Ceramic Herringbone', url: '/assets/black_herringbone.png' },
  { id: 8, title: 'Penny Tile', type: 'Porcelain', url: '/assets/penny_tile.png' }
];

// --- Components ---

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-brand-teal flex items-center justify-center rounded-xl shadow-lg shadow-brand-teal/20">
            <Crown className="text-brand-gold-light w-7 h-7" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full border-2 border-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tighter text-brand-teal uppercase">Queen City</span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase">Backsplash</span>
        </div>
      </div>
      
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#gallery" className="hover:text-brand-teal transition-colors">Gallery</a>
        <a href="#estimate" className="hover:text-brand-teal transition-colors">Personal Quote</a>
        <a href="#process" className="hover:text-brand-teal transition-colors">Our Process</a>
        <a href="#service-area" className="hover:text-brand-teal transition-colors">Service Area</a>
      </nav>

      <div className="flex items-center gap-4">
        <a href="tel:+17047509110" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Phone className="w-4 h-4 text-brand-teal" />
          (704) 750-9110
        </a>
        <a href="#estimate" className="bg-brand-teal text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20">
          Get a Quote
        </a>
      </div>
    </div>
  </header>
);

const Gallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_SAMPLES[0] | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = GALLERY_SAMPLES.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % GALLERY_SAMPLES.length;
    setSelectedImage(GALLERY_SAMPLES[nextIndex]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = GALLERY_SAMPLES.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + GALLERY_SAMPLES.length) % GALLERY_SAMPLES.length;
    setSelectedImage(GALLERY_SAMPLES[prevIndex]);
  };

  return (
    <section id="gallery" className="py-24 bg-slate-50 overflow-hidden">
      <CompletedProjects />
      <div className="max-w-7xl mx-auto px-4 mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Inspiration Gallery</h2>
          <p className="text-slate-600 max-w-2xl">Explore tile styles and design inspiration, from classic subway to modern solid panels. We’ll help you choose the right look for your kitchen.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scroll('right')} className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-4 md:px-[calc((100vw-1280px)/2)] no-scrollbar snap-x snap-mandatory"
      >
        {GALLERY_SAMPLES.map((sample) => (
          <div 
            key={sample.id} 
            onClick={() => setSelectedImage(sample)}
            className="min-w-[300px] md:min-w-[450px] aspect-[4/3] relative rounded-2xl overflow-hidden snap-start group cursor-pointer"
          >
            <img 
              src={sample.url} 
              alt={sample.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{sample.type}</span>
              <h3 className="text-white text-2xl font-bold">{sample.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] hidden sm:block"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] hidden sm:block"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>
            
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0, x: 0 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50;
                if (info.offset.x < -threshold) {
                  handleNext();
                } else if (info.offset.x > threshold) {
                  handlePrev();
                }
              }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center touch-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              />
              <div className="mt-6 text-center">
                <span className="text-brand-teal font-bold uppercase tracking-widest text-xs mb-2 block">{selectedImage.type}</span>
                <h3 className="text-white text-3xl font-bold">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Consultation & Estimate",
      desc: "We start with a detailed review of your space, measurements, and material preferences to provide a transparent, all-inclusive quote."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Preparation",
      desc: "Our team protects your countertops and cabinets, then carefully removes any existing backsplash to ensure a perfectly smooth surface."
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "Expert Installation",
      desc: "Using precision cutting and laser-leveling, we set your chosen tile in the perfect pattern, ensuring every line is crisp and symmetrical."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Grouting & Finishing",
      desc: "We apply high-quality grout and sealant, followed by a deep clean to make your new backsplash shine and resist stains for years."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Final Walkthrough",
      desc: "We don't leave until you're 100% satisfied. We'll walk through the project with you to ensure every detail meets our high standards."
    }
  ];

  return (
    <section id="process" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-teal font-bold uppercase tracking-widest text-xs mb-4 inline-block">How We Work</span>
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Our <span className="text-brand-teal italic">Process</span></h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
            From the first measurement to the final polish, we ensure a seamless and professional experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-200 z-0" />
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-teal mb-6 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 border border-slate-100">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-50">
                  0{index + 1}
                </div>
                <h4 className="font-bold text-slate-900 mb-3 text-lg leading-tight">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Ready to transform your kitchen?</h3>
            <p className="text-slate-500">Talk with Alex about your kitchen and request a personal installation quote.</p>
          </div>
          <a href="#estimate" className="bg-brand-teal text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shrink-0">
            Request My Personal Quote
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-lg">
              <Crown className="text-brand-teal w-7 h-7" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tighter text-white uppercase">Queen City</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase">Backsplash</span>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-8">
            Queen City's premier backsplash installation experts. Fully insured with 5+ years of experience transforming modern kitchens.
          </p>
          <p className="text-slate-400 max-w-sm mb-6">
            Queen City Backsplash is a division of{' '}
            <a href="https://vadconstructions.com/" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-brand-gold-light">VAD Constructions</a>.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
              <span>814 Evans Manor Dr<br />Weddington, NC 28104</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-500 shrink-0" />
              <a href="tel:+17047509110" className="hover:text-white underline underline-offset-4">(704) 750-9110</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500 shrink-0" />
              <a href="mailto:contact@vadconstructions.com" className="hover:text-white">contact@vadconstructions.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
            <li><a href="#estimate" className="hover:text-white transition-colors">Personal Quote</a></li>
            <li><a href="#process" className="hover:text-white transition-colors">Our Process</a></li>
            <li><a href="#service-area" className="hover:text-white transition-colors">Service Area</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
        <p>© 2026 Queen City Backsplash. All rights reserved.</p>
        <div className="flex gap-8">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Fully Insured</span>
          <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> 5+ Years Experience</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const journeyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = journeyRef.current;
    if (!root) return;
    const sections = [
      ['main > section:first-child', 'introduction'],
      ['#gallery', 'inspiration_gallery'],
      ['#process', 'process'],
      ['#service-area', 'service_area'],
      ['#estimate', 'estimate_form'],
      ['footer', 'general_information'],
    ];
    sections.forEach(([selector, name]) => {
      root.querySelector<HTMLElement>(selector)?.setAttribute('data-analytics-section', name);
    });
    return observeJourney(root);
  }, []);
  return (
    <div ref={journeyRef} className="min-h-screen pb-[calc(84px+env(safe-area-inset-bottom))] sm:pb-0">
      <Header />
      
      <main>
        <Hero />
        <Reviews />
        <InquiryForm />
        <Gallery />
        <Process />
        <ServiceArea />
      </main>

      <Footer />
      <MobileContactBar />
    </div>
  );
}
