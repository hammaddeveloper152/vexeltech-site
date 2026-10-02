/* Zee: replace with the exact messages the system sends before launch. */

/* THE MISSED-CALL TEXT-BACK THREAD on /services, Automation (the final
   pass, 2026-10-03). The founder's lines, and the only place they are
   written. The thread is drawn in type (TextBackBand.jsx), a founder-ruled
   exception to BUILD-LAW "Real over drawn" until a real capture of the
   text-back replaces it.

   `number` is the business line the thread is with; `kind` is who speaks:
   the system line, sent (the business, yellow) or received (the caller). */
export const THREAD = {
  number: '(385) 284-3265',
  lines: [
    { kind: 'system', text: 'Missed call, 2:14 PM' },
    { kind: 'sent', text: "Sorry we missed you. Reply here with what you need and we'll call back within the hour." },
    { kind: 'received', text: 'Hi, need a quote for a kitchen remodel' },
    { kind: 'sent', text: 'Got it. Sending a couple of times for a quick call. Watch for a text from this number.' },
  ],
  caption: 'Missed-call text-back. Replies in under sixty seconds, every time.',
};
