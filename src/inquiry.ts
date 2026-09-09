export interface Inquiry {
  name: string;
  phone: string;
  zip: string;
  email: string;
}

export const INQUIRY_ENDPOINT = 'https://htmczrw2tgityftpxj5535hdye0zreqf.lambda-url.us-east-1.on.aws';

export function validateInquiry(data: Inquiry, covered: (zip: string) => boolean) {
  const errors: Partial<Record<keyof Inquiry, string>> = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  const digits = data.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(data.phone.trim()) || !(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) {
    errors.phone = 'Please enter a valid US phone number.';
  }
  if (!/^\d{5}(-\d{4})?$/.test(data.zip.trim())) errors.zip = 'Please enter a valid ZIP code.';
  else if (!covered(data.zip.trim())) errors.zip = 'This ZIP is outside our listed service area. Call Alex to discuss your location.';
  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Please enter a valid email or leave it blank.';
  return errors;
}

export async function submitInquiry(data: Inquiry, request: typeof fetch = fetch) {
  const response = await request(INQUIRY_ENDPOINT, {
    method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ source: 'qcb', name: data.name.trim(), phone: data.phone.trim(), zip: data.zip.trim(), email: data.email.trim() }),
  });
  if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
}
