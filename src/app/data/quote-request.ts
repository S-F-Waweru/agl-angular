/**
 * Quote / site-visit requests from the Home and Contact forms.
 *
 * For now a submission opens the visitor's mail service with the request
 * prefilled, addressed to AGL. When the email backend API is ready, replace
 * the body of `submitQuoteRequest` with a POST to it — callers won't change.
 */

export const QUOTE_INBOX = 'alternativeglasslimited@gmail.com';

export interface QuoteRequest {
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  details: string;
  method: string;
}

/** Reads the shared quote form fields, whose ids are `${prefix}name`, `${prefix}phone`, ... */
export function readQuoteForm(form: HTMLFormElement, prefix = ''): QuoteRequest {
  const value = (field: keyof QuoteRequest): string =>
    (form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${prefix}${field}`)?.value ?? '').trim();
  return {
    name: value('name'),
    phone: value('phone'),
    email: value('email'),
    location: value('location'),
    service: value('service'),
    details: value('details'),
    method: value('method')
  };
}

function subject(req: QuoteRequest): string {
  return `Quote / Site Visit Request — ${req.service || 'General enquiry'} — ${req.name}`;
}

function body(req: QuoteRequest): string {
  const dash = (v: string): string => v || '—';
  return [
    'Hello Alternative Glasses Limited,',
    '',
    'I would like to request a site visit / quote.',
    '',
    `Full name: ${dash(req.name)}`,
    `Phone: ${dash(req.phone)}`,
    `Email: ${dash(req.email)}`,
    `Project location: ${dash(req.location)}`,
    `Service required: ${dash(req.service)}`,
    `Preferred contact method: ${dash(req.method)}`,
    '',
    'Project description:',
    dash(req.details),
    '',
    'Sent from the AGL website.'
  ].join('\n');
}

/** True on phones/tablets, where mailto: hands off to the installed mail app (e.g. the Gmail app). */
function isMobile(): boolean {
  return window.matchMedia?.('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Opens a prefilled email to AGL: the device's mail app on mobile, Gmail's
 * web compose window on desktop (where mailto: often has no handler).
 */
export function submitQuoteRequest(req: QuoteRequest): void {
  const su = subject(req);
  const text = body(req);

  if (isMobile()) {
    window.location.href = `mailto:${QUOTE_INBOX}?subject=${encodeURIComponent(su)}&body=${encodeURIComponent(text)}`;
    return;
  }

  const gmail = new URL('https://mail.google.com/mail/');
  gmail.searchParams.set('view', 'cm');
  gmail.searchParams.set('fs', '1');
  gmail.searchParams.set('to', QUOTE_INBOX);
  gmail.searchParams.set('su', su);
  gmail.searchParams.set('body', text);
  // No 'noopener' feature string here: with it window.open always returns null,
  // which would make a successful open look like a blocked popup.
  const opened = window.open(gmail.toString(), '_blank');
  if (opened) {
    opened.opener = null;
  } else {
    // Popup blocked — fall back to the default mail client.
    window.location.href = `mailto:${QUOTE_INBOX}?subject=${encodeURIComponent(su)}&body=${encodeURIComponent(text)}`;
  }
}
