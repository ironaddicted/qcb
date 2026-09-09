import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle, MessageSquare, Phone } from 'lucide-react';
import { trackEvent } from './analytics';
import { isZipInServiceArea } from './serviceAreaData';
import { Inquiry, submitInquiry, validateInquiry } from './inquiry';
import { CALL_URL, TEXT_URL, RESPONSE_TIME } from './contact';

const eventDetails = { form_id: 'estimate', form_version: 'short_inquiry', step_name: 'quick_inquiry', step_number: 1 };

export default function InquiryForm() {
  const [data, setData] = useState<Inquiry>({ name: '', phone: '', zip: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Inquiry, string>>>({});
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const locked = useRef(false);
  const started = useRef(false);
  const errorSummary = useRef<HTMLDivElement>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (locked.current) return;
    const validation = validateInquiry(data, isZipInServiceArea);
    setErrors(validation);
    if (Object.keys(validation).length) {
      trackEvent('estimate_validation_error', eventDetails);
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    locked.current = true;
    setPending(true);
    setSubmissionError('');
    trackEvent('estimate_submit_attempt', eventDetails);
    try {
      await submitInquiry(data);
    } catch {
      locked.current = false;
      setPending(false);
      setSubmissionError('We couldn’t confirm your request. Please try again, or call/text Alex directly.');
      trackEvent('estimate_submit_error', eventDetails);
      return;
    }
    setSuccess(true);
    setPending(false);
    trackEvent('generate_lead', eventDetails);
    try {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'conversion', {
        send_to: 'AW-16582460982/cr4VCNeZ2bMZELaMkeM9', value: 1.0, currency: 'USD',
      });
    } catch { /* Accepted inquiries remain successful if tracking is blocked. */ }
  };

  return (
    <section id="estimate" data-analytics-section="estimate_form" className="py-16 md:py-24 bg-slate-50 scroll-mt-24" aria-labelledby="inquiry-heading">
      <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[0.8fr_1fr] gap-10 lg:gap-16">
        <div>
          <p className="text-brand-teal text-xs font-bold uppercase tracking-widest mb-4">Let’s talk about your kitchen</p>
          <h2 id="inquiry-heading" className="text-3xl md:text-4xl font-bold mb-5">Your personal backsplash quote starts here.</h2>
          <p className="text-slate-600 leading-relaxed mb-4">Just your contact details. Alex will discuss your kitchen, help with measurements, and prepare a personal quote.</p>
          <p className="font-semibold text-brand-teal mb-6">{RESPONSE_TIME}</p>
          <p className="text-sm text-slate-500 mb-6">No measurements or material decisions needed. This is a free quote request; your project price follows a conversation about the work.</p>
          <a href={CALL_URL} className="inline-flex items-center gap-2 font-semibold text-brand-teal underline underline-offset-4"><Phone className="w-4 h-4" /> Prefer to talk? Call Alex</a>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          {success ? (
            <div role="status" className="space-y-5">
              <CheckCircle className="h-12 w-12 text-brand-teal" />
              <h3 className="text-2xl font-bold">Thanks, {data.name.trim()} — your request is in.</h3>
              <p className="text-slate-600">Alex will contact you at {data.phone}. {RESPONSE_TIME}</p>
              <p className="text-slate-600">Next, we’ll talk through your backsplash, measurements, material options, and installation needs.</p>
              <a href={TEXT_URL} onClick={() => trackEvent('contact_click', { method: 'sms', placement: 'confirmation' })} className="inline-flex gap-2 items-center font-semibold text-brand-teal underline underline-offset-4"><MessageSquare className="w-5 h-5" /> Text Kitchen Photos (optional)</a>
              <p className="text-sm text-slate-500">Attach your photos in your messaging app and include your name so Alex can match them to your request.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate data-analytics-inquiry="true" onChange={() => {
              if (!started.current) { started.current = true; trackEvent('estimate_start', eventDetails); }
            }}>
              {Object.values(errors).some(Boolean) && <div ref={errorSummary} tabIndex={-1} role="alert" className="text-red-700 mb-4">Please check the highlighted fields.</div>}
              <fieldset disabled={pending} className="grid sm:grid-cols-2 gap-5 disabled:opacity-60">
                <legend className="sr-only">Your contact details</legend>
                {([
                  ['name', 'Name', 'text', 'name', 'Your name'],
                  ['phone', 'Phone', 'tel', 'tel', '(704) 555-0123'],
                  ['zip', 'ZIP code', 'text', 'postal-code', '28202'],
                  ['email', 'Email (optional)', 'email', 'email', 'you@example.com'],
                ] as const).map(([key, label, type, autoComplete, placeholder]) => (
                  <div key={key}>
                    <label htmlFor={`inquiry-${key}`} className="block text-sm font-semibold mb-2">{label}</label>
                    <input id={`inquiry-${key}`} name={key} type={type} autoComplete={autoComplete} inputMode={key === 'zip' ? 'numeric' : undefined} required={key !== 'email'} value={data[key]} placeholder={placeholder} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `inquiry-${key}-error` : undefined}
                      onChange={event => { setData({ ...data, [key]: event.target.value }); setErrors(current => ({ ...current, [key]: undefined })); }}
                      className={`w-full min-w-0 rounded-xl border px-4 py-3 text-base focus:outline-2 focus:outline-brand-teal ${errors[key] ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors[key] && <p id={`inquiry-${key}-error`} className="text-sm text-red-700 mt-2">{errors[key]}</p>}
                  </div>
                ))}
              </fieldset>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <a href={TEXT_URL} onClick={() => trackEvent('contact_click', { method: 'sms', placement: 'inquiry' })} className="inline-flex items-center gap-2 font-semibold text-brand-teal underline underline-offset-4"><MessageSquare className="w-5 h-5" /> Text Kitchen Photos (optional)</a>
                <p className="text-sm text-slate-500 mt-2">Have a photo handy? Attach it in your messaging app. You can also send it after requesting your quote.</p>
              </div>
              {submissionError && <p role="alert" className="text-red-700 mt-5">{submissionError}</p>}
              <button type="submit" disabled={pending} className="mt-6 w-full rounded-xl bg-brand-teal px-5 py-4 text-white font-bold flex justify-center items-center gap-2 disabled:opacity-60 hover:bg-brand-teal/90">{pending ? 'Sending your request…' : 'Request My Personal Quote'}<ArrowRight className="w-5 h-5" /></button>
              <p className="text-xs leading-relaxed text-slate-500 mt-4">By sending this request, you’re asking Alex at VAD Constructions to contact you about your project.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
