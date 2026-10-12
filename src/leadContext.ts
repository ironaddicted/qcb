// Keep campaign context with the inquiry, never in Analytics form-content events.
export function leadContext(): string {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
    const campaign = fields.filter(key => params.has(key)).map(key => `${key}=${params.get(key)!.replace(/[\r\n]/g, ' ').slice(0, 180)}`).join('; ');
    if (campaign) sessionStorage.setItem('qcb-lead-campaign', campaign);
    return `Website: QCB; Entry: ${window.location.pathname}; Campaign: ${campaign || sessionStorage.getItem('qcb-lead-campaign') || 'not tagged'}`;
  } catch { return 'Website: QCB'; }
}

export function captureLeadContext() { leadContext(); }
