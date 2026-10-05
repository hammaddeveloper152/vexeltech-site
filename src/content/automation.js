/* Zee: replace with the exact messages the system sends before launch. */

/* THE MISSED CALL on /services, Automation (the final pass, 2026-10-03;
   rebuilt 2026-10-06, the founder's quality pass). The founder's lines,
   and the only place they are written. The stage is drawn in type and CSS
   (TextBackBand.jsx): a phone with the thread, a calendar and a receipt.

   `number` is the business line the thread is with; `kind` is who speaks:
   the system line, sent (the business, in the discipline's colour) or
   received (the caller).

   THE SYSTEM LOG of final9 is gone with the two-column layout: the
   calendar carries the booking and the receipt the events after it.

   `calendar.booking` is the block that fills Thursday at 10:00 when the
   thread reaches the booking. `receipt` is the rows, in order, with the
   one that takes the PAID stamp and the one that takes the stars. */
export const THREAD = {
  number: '(385) 284-3265',
  lines: [
    { kind: 'system', text: 'Missed call, 2:14 PM' },
    { kind: 'sent', text: "Sorry we missed you. Reply here with what you need and we'll call back within the hour." },
    { kind: 'received', text: 'Hi, need a quote for a kitchen remodel' },
    { kind: 'sent', text: 'Got it. Sending a couple of times for a quick call. Watch for a text from this number.' },
  ],
  calendar: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    slot: '10:00',
    booking: 'Kitchen quote, 10:00',
  },
  receipt: [
    { label: 'Quote sent', time: 'Thu 11:30' },
    { label: 'Invoice sent', time: 'Fri 9:00' },
    { label: 'Paid', time: 'Fri 14:12', stamp: 'PAID' },
    { label: 'Review request', time: 'Sat 10:00', stars: 5 },
  ],
  caption: 'One missed call, handled end to end. Replies in under sixty seconds, every time.',
};
