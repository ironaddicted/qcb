type Parameters = Record<string, string | number>;
type AnalyticsWindow = Window & {
  gtag?: (command: string, name: string, parameters?: Parameters) => void;
};

const measurementId = (import.meta as ImportMeta & {
  env: Record<string, string | undefined>;
}).env.VITE_GA4_MEASUREMENT_ID ?? 'G-XMQGDWGHL2';
const enabled = /^G-[A-Z0-9]+$/.test(measurementId ?? '');

// Explicit routing keeps browsing events separate from Google Ads conversions.
export function trackEvent(name: string, parameters: Parameters = {}) {
  if (!enabled) return;
  try {
    (window as AnalyticsWindow).gtag?.('event', name, {
      ...parameters,
      send_to: measurementId!,
    });
  } catch {
    // Analytics must never interrupt the visitor's form or navigation.
  }
}

export function initializeAnalytics() {
  if (enabled) (window as AnalyticsWindow).gtag?.('config', measurementId!);
}

export const FORM_STEPS = [
  'project_dimensions', 'existing_backsplash', 'tile_material',
  'tile_pattern', 'contact_information', 'review',
] as const;

export function stepParameters(step: number): Parameters {
  return { form_id: 'estimate', step_number: step + 1, step_name: FORM_STEPS[step] };
}

// Kept outside React effects so StrictMode does not duplicate views.
const viewed = new Set<string>();

export function observeJourney(root: HTMLElement) {
  const cleanups = new Map<Element, () => void>();
  const register = () => {
    for (const [element, cleanup] of cleanups) {
      if (!root.contains(element)) { cleanup(); cleanups.delete(element); }
    }
    root.querySelectorAll<HTMLElement>('[data-analytics-section], [data-analytics-step], [data-analytics-inquiry]').forEach(element => {
      if (cleanups.has(element)) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const section = element.dataset.analyticsSection;
      const inquiry = element.dataset.analyticsInquiry === 'true';
      const step = Number(element.dataset.analyticsStep);
      const key = section ? `section:${section}` : inquiry ? 'inquiry' : `step:${step}`;
      let recorded = false;
      const visible = () => {
        if (document.visibilityState !== 'visible') return false;
        const rect = element.getBoundingClientRect();
        const height = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 80);
        return rect.height > 0 && rect.right > 0 && rect.left < window.innerWidth
          && height >= Math.min(rect.height / 2, (window.innerHeight - 80) / 4);
      };
      const check = () => {
        if (recorded || (section && viewed.has(key)) || !visible()) {
          clearTimeout(timer); timer = undefined; return;
        }
        if (timer !== undefined) return;
        timer = setTimeout(() => {
          timer = undefined;
          if (!root.contains(element) || !visible() || recorded || (section && viewed.has(key))) return;
          recorded = true;
          if (section) viewed.add(key);
          trackEvent(section ? 'section_view' : 'estimate_step_view', section
            ? { section_name: section }
            : inquiry ? { form_id: 'estimate', form_version: 'short_inquiry', step_number: 1, step_name: 'quick_inquiry' } : stepParameters(step));
        }, 1000);
      };
      const observer = new IntersectionObserver(check, {
        rootMargin: '-80px 0px 0px 0px',
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      });
      observer.observe(element);
      document.addEventListener('visibilitychange', check);
      window.addEventListener('resize', check);
      check();
      cleanups.set(element, () => {
        clearTimeout(timer);
        observer.disconnect();
        document.removeEventListener('visibilitychange', check);
        window.removeEventListener('resize', check);
      });
    });
  };
  const mutations = new MutationObserver(register);
  mutations.observe(root, { childList: true, subtree: true });
  register();
  return () => {
    mutations.disconnect();
    cleanups.forEach(cleanup => cleanup());
  };
}
