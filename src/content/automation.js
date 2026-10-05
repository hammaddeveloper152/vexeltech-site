/* Zee: replace with the exact messages the system sends before launch. */

/* THE MISSED-CALL TEXT-BACK THREAD on /services, Automation (the final
   pass, 2026-10-03). The founder's lines, and the only place they are
   written. The thread is drawn in type (TextBackBand.jsx), a founder-ruled
   exception to BUILD-LAW "Real over drawn" until a real capture of the
   text-back replaces it.

   `number` is the business line the thread is with; `kind` is who speaks:
   the system line, sent (the business, in the discipline's colour) or
   received (the caller).

   THE SYSTEM LOG, 2026-10-05 (the founder's final9): what happens around
   the thread, beside it. Each entry's `with` is the thread line it lands
   with; entries without one follow the last, 300ms apart. */
export const THREAD = {
  number: '(385) 284-3265',
  lines: [
    { kind: 'system', text: 'Missed call, 2:14 PM' },
    { kind: 'sent', text: "Sorry we missed you. Reply here with what you need and we'll call back within the hour." },
    { kind: 'received', text: 'Hi, need a quote for a kitchen remodel' },
    { kind: 'sent', text: 'Got it. Sending a couple of times for a quick call. Watch for a text from this number.' },
  ],
  log: [
    { time: '2:14 PM', event: 'Missed call', with: 0 },
    { time: '2:14 PM', event: 'Text sent, 4 seconds', with: 1 },
    { time: '2:16 PM', event: 'Reply received', with: 2 },
    { time: '2:16 PM', event: 'Booking link sent', with: 3 },
    { time: '2:19 PM', event: 'Booked, Thu 10:00' },
    { time: 'Thu 9:00', event: 'Reminder sent' },
    { time: 'Thu 11:30', event: 'Invoice sent' },
    { time: 'Sat 10:00', event: 'Review request sent' },
  ],
  caption: 'One missed call, handled end to end. Replies in under sixty seconds, every time.',
};
