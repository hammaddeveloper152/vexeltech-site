/* RECENT WORK, the data (the founder, 2026-10-01). Home's Recent work strip
   reads this file (components/story/RecentWork.jsx).

   EACH ENTRY:
     slug       the screenshot's file name: /public/work/<slug>.jpg, a 16:10
                desktop capture (2400 x 1500 is a good size), cropped once
     name       the business, as it trades
     industry   one or two words: "Bookkeeping", "Real estate"
     city       "Wichita Falls TX"
     line       one line of what the job was: "Six-page site, branding."
                (VEXELTECH-COPY.md V3.1: no adjectives)
     url        the live site, opened from the plate
     shot       true once /public/work/<slug>.jpg is in the repo

   AN ENTRY IS REAL when it has a `name` and `shot` is true. THE SECTION
   RENDERS NOTHING until three entries are real (BUILD-LAW Truth: no
   invented clients). The six below are placeholders, nothing in them is
   shown, and each is replaced by the founder's own. */
export const WORK = [
  { slug: 'placeholder-1', name: null, industry: null, city: null, line: null, url: null, shot: false },
  { slug: 'placeholder-2', name: null, industry: null, city: null, line: null, url: null, shot: false },
  { slug: 'placeholder-3', name: null, industry: null, city: null, line: null, url: null, shot: false },
  { slug: 'placeholder-4', name: null, industry: null, city: null, line: null, url: null, shot: false },
  { slug: 'placeholder-5', name: null, industry: null, city: null, line: null, url: null, shot: false },
  { slug: 'placeholder-6', name: null, industry: null, city: null, line: null, url: null, shot: false },
];

/* The entries that can be shown, and whether there are enough to show any. */
export const REAL_WORK = WORK.filter((w) => w.name && w.shot);
export const MIN_WORK = 3;
