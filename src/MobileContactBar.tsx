import { MessageSquare, Phone } from 'lucide-react';
import { CALL_URL, TEXT_URL } from './contact';
import { trackEvent } from './analytics';

export default function MobileContactBar() {
  return (
    <nav aria-label="Contact us" className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-slate-200 bg-white px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] grid grid-cols-2 gap-3 shadow-lg">
      <a href={CALL_URL} onClick={() => trackEvent('contact_click', { method: 'call', placement: 'mobile_bar' })} className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-brand-teal border border-brand-teal"><Phone className="w-4 h-4" />Call Us</a>
      <a href={TEXT_URL} onClick={() => trackEvent('contact_click', { method: 'sms', placement: 'mobile_bar' })} className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white bg-brand-teal"><MessageSquare className="w-4 h-4" />Text Kitchen Photos</a>
    </nav>
  );
}
