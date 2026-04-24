/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StaggeredIcon from '../public/assets/staggered.svg';
import StackedIcon from '../public/assets/stacked.svg';
import HerringboneIcon from '../public/assets/herringbone.svg';
import MosaicIcon from '../public/assets/mosaic.svg'
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  ArrowRight,
  Ruler,
  Archive,
  ShieldCheck,
  Award,
  Crown,
  ClipboardList,
  Hammer,
  Sparkles,
  CheckCircle
} from 'lucide-react';

// --- Types ---
type TileType = 'ceramic' | 'glass' | 'solid';
type TilePattern = 'staggered' | 'stacked' | 'herringbone' | 'mosaic';

interface FormData {
  areaType: 'sqft' | 'cabinets';
  areaValue: string;
  hasExisting: boolean;
  needsDemolition: boolean;
  tileType: TileType;
  pattern?: TilePattern;
  name: string;
  phone: string;
  email: string;
}

// --- Constants ---
const GALLERY_SAMPLES = [
  { id: 1, title: 'Vibrant Green Subway', type: 'Ceramic', url: '/src/assets/green_glass.jpg' },
  { id: 2, title: 'Modern Checkerboard', type: 'Porcelain', url: '/src/assets/g_combined_white_grey_zellenge.jpg' },
  { id: 3, title: 'Seamless Quartz Panel', type: 'Quartz', url: '/src/assets/g_pvc_backsplash.jpg' },
  { id: 4, title: 'Artisan Green Square', type: 'Ceramic', url: '/src/assets/g_zellige_green.jpg' },
  { id: 5, title: 'Classic White Subway', type: 'Ceramic', url: '/src/assets/gen_2.png' },
  { id: 6, title: 'Emerald Glass Subway', type: 'Glass', url: '/src/assets/emerald_sub.png' },
  { id: 7, title: 'Herringbone', type: 'Ceramic Herringbone', url: '/src/assets/black_herringbone.png' },
  { id: 8, title: 'Penny Tile', type: 'Porcelain', url: '/src/assets/penny_tile.png' }
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
      
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#gallery" className="hover:text-brand-teal transition-colors">Gallery</a>
        <a href="#estimate" className="hover:text-brand-teal transition-colors">Free Estimate</a>
        <a href="#process" className="hover:text-brand-teal transition-colors">Our Process</a>
      </nav>

      <div className="flex items-center gap-4">
        <a href="tel:+17047509110" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Phone className="w-4 h-4 text-brand-teal" />
          (704) 750-9110
        </a>
        <a href="#estimate" className="bg-brand-teal text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20">
          Get Started
        </a>
      </div>
    </div>
  </header>
);

const Gallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Inspiration Gallery</h2>
          <p className="text-slate-600 max-w-2xl">Explore our recent installations featuring premium materials and expert craftsmanship. From classic subway to modern solid panels.</p>
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
          <div key={sample.id} className="min-w-[300px] md:min-w-[450px] aspect-[4/3] relative rounded-2xl overflow-hidden snap-start group">
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
    </section>
  );
};

const EstimateForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    source: 'qcb',
    areaType: 'sqft',
    areaValue: '',
    hasExisting: false,
    needsDemolition: false,
    zip : '',
    tileType: 'ceramic',
    name: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => {
    if (step === 2 && formData.tileType === 'solid') {
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 4 && formData.tileType === 'solid') {
      setStep(2);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://htmczrw2tgityftpxj5535hdye0zreqf.lambda-url.us-east-1.on.aws', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(formData),
      });

      // With no-cors, we can't check response.ok or response.status.
      // It will be an "opaque" response.
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Project Dimensions</h3>
              <p className="text-slate-500">How should we calculate your backsplash area?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, areaType: 'sqft'})}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.areaType === 'sqft' ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
                  <Ruler className="w-5 h-5 text-brand-teal" />
                </div>
                <h4 className="font-bold mb-1">By Square Footage</h4>
                <p className="text-sm text-slate-500">I know the exact sqft of the area.</p>
              </button>
              <button 
                onClick={() => setFormData({...formData, areaType: 'cabinets'})}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.areaType === 'cabinets' ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
                  <Archive className="w-5 h-5 text-brand-teal" />
                </div>
                <h4 className="font-bold mb-1">By Cabinet Count</h4>
                <p className="text-sm text-slate-500">Number of bottom cabinets/appliances.</p>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {formData.areaType === 'sqft' ? 'Total Square Feet' : 'Number of Bottom Cabinets (incl. range/dishwasher)'}
              </label>
              <input 
                type="number"
                value={formData.areaValue}
                onChange={(e) => setFormData({...formData, areaValue: e.target.value})}
                placeholder={formData.areaType === 'sqft' ? 'e.g. 35' : 'e.g. 6'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Existing Backsplash</h3>
              <p className="text-slate-500">Do we need to remove an old backsplash first?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, hasExisting: true, needsDemolition: true})}
                className={`p-8 rounded-2xl border-2 transition-all ${formData.hasExisting ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <span className="text-lg font-bold">Yes</span>
                <p className="text-sm text-slate-500 mt-1">Demolition needed</p>
              </button>
              <button 
                onClick={() => setFormData({...formData, hasExisting: false, needsDemolition: false})}
                className={`p-8 rounded-2xl border-2 transition-all ${!formData.hasExisting ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <span className="text-lg font-bold">No</span>
                <p className="text-sm text-slate-500 mt-1">Fresh installation</p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Tile Material</h3>
              <p className="text-slate-500">What kind of material are you looking for?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  id: 'ceramic', 
                  label: 'Ceramic / Porcelain', 
                  desc: 'Durable, classic, and versatile',
                  image: '/src/assets/ceramic_2.png'
                },
                { 
                  id: 'glass', 
                  label: 'Glass', 
                  desc: 'Modern, reflective, and easy to clean',
                  image: '/src/assets/glass_selector.png'
                },
                { 
                  id: 'solid', 
                  label: 'Solid Panel', 
                  desc: 'Seamless quartz or stone look',
                  image: '/src/assets/solid_panel.png'
                }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setFormData({...formData, tileType: item.id as TileType})}
                  className={`group relative h-32 rounded-2xl border-2 overflow-hidden text-left transition-all ${
                    formData.tileType === item.id ? 'border-brand-teal ring-4 ring-brand-teal/10' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={item.image} 
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 transition-colors duration-300 ${
                      formData.tileType === item.id ? 'bg-brand-teal/60' : 'bg-black/40 group-hover:bg-black/30'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex items-center justify-between h-full">
                    <div>
                      <h4 className="font-bold text-white text-xl mb-1 drop-shadow-md">{item.label}</h4>
                      <p className="text-sm text-slate-100 drop-shadow-sm">{item.desc}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      formData.tileType === item.id ? 'bg-white scale-110' : 'bg-white/20 backdrop-blur-sm'
                    }`}>
                      {formData.tileType === item.id ? (
                        <Check className="w-5 h-5 text-brand-teal" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Tile Pattern</h3>
              <p className="text-slate-500">Choose the layout for your {formData.tileType} tiles.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'staggered', label: 'Staggered', icon: <img src={StaggeredIcon} className="w-8 h-8 opacity-70" alt="" />, desc: '50% offset' },
                { id: 'stacked', label: 'Stacked', icon: <img src={StackedIcon} className="w-8 h-8 opacity-70" alt="" />, desc: 'Aligned grid' },
                { id: 'herringbone', label: 'Herringbone', icon: <img src={HerringboneIcon} className="w-8 h-8 opacity-70" alt="" />, desc: 'V-shape pattern' },
                { id: 'mosaic', label: 'Mosaic', icon: <img src={MosaicIcon} className="w-8 h-8 opacity-70" alt="" />, desc: 'Hex or small pattern' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setFormData({...formData, pattern: item.id as TilePattern})}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${formData.pattern === item.id ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="w-12 h-12 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm">{item.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Contact Details</h3>
              <p className="text-slate-500">Where should we send your estimate?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input 
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Zip Code</label>
                <input
                  type="zip"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-brand-teal" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to Submit?</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Review your selections below before sending your request.
              </p>
            </div>

            {/* Project Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Dimensions</p>
                  <p className="font-semibold text-slate-900">{formData.areaValue} {formData.areaType === 'sqft' ? 'sqft' : 'cabinets'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Demolition</p>
                  <p className="font-semibold text-slate-900">{formData.hasExisting ? 'Required' : 'Not Needed'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Material</p>
                  <p className="font-semibold text-slate-900 capitalize">{formData.tileType}</p>
                </div>
                {formData.tileType !== 'solid' && (
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Pattern</p>
                    <p className="font-semibold text-slate-900 capitalize">{formData.pattern || 'Standard'}</p>
                  </div>
                )}
                <div className="col-span-2 pt-3 border-t border-slate-200">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Contact Information</p>
                  <p className="font-semibold text-slate-900">{formData.name} • {formData.phone}</p>
                  <p className="text-slate-500 text-xs">{formData.email}</p>
                  {formData.zip && <p className="text-slate-500 text-xs mt-1">Zip Code: {formData.zip}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand-teal text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-brand-teal/20"
              >
                {isSubmitting ? 'Processing...' : 'Submit Estimate Request'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <section id="estimate" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-100"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="text-white w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Request Received!</h2>
            <p className="text-slate-600 text-lg mb-8">
              Thank you, {formData.name}. We've received your request and our specialists are already working on your estimate.
            </p>
            <p className="text-slate-400 text-sm italic">
              Our team will contact you shortly at {formData.phone} or {formData.email}.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="estimate" className="py-24 bg-white min-h-[800px] flex items-center">
      <div className="max-w-3xl mx-auto px-4 w-full">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {step + 1} of 6</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-slate-900' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900">Free Estimate</h2>
        </div>

        <div className="relative overflow-hidden min-h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 5 && (
          <div className="mt-12 flex items-center justify-between gap-4">
            <button 
              onClick={prevStep}
              disabled={step === 0}
              className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-0"
            >
              Back
            </button>
            <button 
              onClick={nextStep}
              disabled={step === 0 && !formData.areaValue}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
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
            <p className="text-slate-500">Get a professional estimate for your project today.</p>
          </div>
          <a href="#estimate" className="bg-brand-teal text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shrink-0">
            Get My Free Estimate
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
              <span>123 Design District,<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-500 shrink-0" />
              <span>(555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500 shrink-0" />
              <span>hello@queencitybacksplash.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
            <li><a href="#estimate" className="hover:text-white transition-colors">Free Estimate</a></li>
            <li><a href="#process" className="hover:text-white transition-colors">Our Process</a></li>
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
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-widest">
                  Expert Installation
                </span>
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-teal text-white text-xs font-bold uppercase tracking-widest">
                  Fully Insured
                </span>
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-widest">
                  5+ Years Experience
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-[0.9] mb-8 tracking-tighter">
                Queen City's Premier <span className="text-brand-teal italic">Backsplash</span> Experts.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Professional backsplash installation for subway, herringbone, glass, and solid panels. Get a free estimate in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#estimate" className="bg-brand-teal text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all shadow-2xl shadow-brand-teal/20 flex items-center gap-2">
                  Start Estimate
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#gallery" className="px-10 py-5 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                  View Gallery
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div className="w-full h-full bg-slate-50 rounded-bl-[200px] overflow-hidden">
              <img 
                src="https://storage.googleapis.com/applet-assets/input_file_2.png" 
                alt="Modern Kitchen Tile" 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        <Gallery />
        <Process />
        <EstimateForm />
      </main>

      <Footer />
    </div>
  );
}
