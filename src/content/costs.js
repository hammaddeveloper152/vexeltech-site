/* HOME, WHAT IT COSTS YOU: THE CITED NUMBERS (the founder's approved frame
   C, final15, 2026-10-06). Four cells, each a figure from a named industry
   source, not ours. The words are the founder's, verbatim from the brief.
   `disc` is the cell's colour (its 3px top rule and its label), in the
   brief's order: yellow, lilac, coral, mint. `source` is the line pinned
   to the cell's foot; `href` is the page it cites, also listed in the
   footer's legal row (FooterMeta.jsx, SOURCES below).

   Checked 2026-10-06: Backlinko's CTR study gives 0.63% of searchers
   clicking a page-two result; WordStream's 2025 benchmarks give $70.11 as
   the average cost per lead on Google search; Invoca's post of 2024-05-23
   gives 27% of calls to home services unanswered and "less than 3%" of
   callers sent to voicemail leaving a message. The "60M calls analysed" in
   cell 3's source line is the founder's and is not stated on that page. */
export const INVOCA = 'https://www.invoca.com/blog/how-much-missed-sales-calls-cost-home-services-businesses';

export const COSTS = [
  {
    id: 'found',
    disc: 'var(--c-yellow-d)',
    label: 'Not found',
    figure: '0.6%',
    line: 'of searchers ever click a page-two result.',
    note: 'If you are not on page one for what you do, you are not in the running.',
    source: 'Backlinko, Google CTR study',
    href: 'https://backlinko.com/google-ctr-stats',
  },
  {
    id: 'spend',
    disc: 'var(--c-lilac)',
    label: 'Ad spend',
    figure: '$70',
    line: 'average cost per lead on Google search, US.',
    note: 'Most owners paying it could not tell you their own number.',
    source: 'WordStream, Google Ads Benchmarks 2025 ($70.11)',
    href: 'https://www.wordstream.com/blog/2025-google-ads-benchmarks',
  },
  {
    id: 'missed',
    disc: 'var(--c-coral)',
    label: 'The missed call',
    figure: '27%',
    line: 'of calls to home-service businesses go unanswered.',
    note: 'The caller dials the next number on the list.',
    source: 'Invoca, 60M calls analysed, 2024',
    href: INVOCA,
  },
  {
    id: 'voicemail',
    disc: 'var(--c-mint)',
    label: 'The voicemail',
    figure: '<3%',
    line: 'of callers sent to voicemail leave a message.',
    note: 'The rest are gone, and you never knew they called.',
    source: 'Invoca, 2024',
    href: INVOCA,
  },
];

/* The footer's Sources line: one link per page cited. Cells 3 and 4 cite
   the same Invoca post, so it is one link. */
export const SOURCES = [
  { label: 'Backlinko', href: COSTS[0].href },
  { label: 'WordStream', href: COSTS[1].href },
  { label: 'Invoca', href: INVOCA },
];
