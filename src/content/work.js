/* RECENT WORK, the data (the founder, 2026-10-01; filled 2026-10-02 with
   the founder's seven). Home's Recent work strip reads this file
   (components/story/RecentWork.jsx).

   EACH ENTRY:
     slug       the screenshot's name: /public/work/<slug>.jpg (1440 x 900)
                and <slug>-720.jpg (720 x 450, phones), taken by
                .measure/work-shots.mjs from the live site's first viewport
     name       the business, as it trades
     industry   one or two words
     city       where it is
     line       what the job was (VEXELTECH-COPY.md V3.1: no adjectives)
     url        the live site, opened from the plate in a new tab
     shown      false keeps an entry out of the strip

   An entry shows when it has a name and is not `shown: false`. THE SECTION
   RENDERS NOTHING until three entries show (BUILD-LAW Truth, and Real over
   drawn: no placeholder plates). */
export const WORK = [
  {
    slug: 'baseline-books',
    name: 'Baseline Bookkeeping',
    industry: 'Bookkeeping',
    city: 'Wichita Falls TX',
    line: 'Website',
    url: 'https://www.baseline-books.com/',
  },
  {
    slug: 'zions-caregivers',
    name: 'Zions Caregivers',
    industry: 'Care services',
    city: 'Ohio',
    line: 'Website',
    url: 'https://zionscaregivers.com/',
  },
  {
    slug: 'artiora',
    name: 'ARTIORA Luxury Villa',
    industry: 'Hospitality',
    city: 'Sosúa DR',
    line: 'Website',
    url: 'https://artluxuryvilla.com/',
  },
  {
    slug: 'altavia',
    name: 'AltaVia Group',
    industry: 'Consulting',
    city: 'US and Latin America',
    line: 'Website',
    url: 'https://altavianexus.com',
  },
  {
    slug: 'onesix',
    name: 'OneSix',
    industry: 'Data and AI consulting',
    city: 'US',
    line: 'Website',
    url: 'https://www.onesix.ai/',
  },
  {
    slug: 'edgeq',
    name: 'EdgeQ',
    industry: 'Semiconductors',
    city: 'Santa Clara CA',
    line: 'Website',
    url: 'https://www.edgeq.io/',
  },
  {
    slug: 'christal-clear',
    name: 'Christal Clear Properties',
    industry: 'Real estate',
    city: 'St. Simons Island GA',
    line: 'Website',
    url: 'https://christalclearproperties.com/',
    shown: false,
  },
];

/* The entries that show, and whether there are enough to show any. */
export const REAL_WORK = WORK.filter((w) => w.name && w.shown !== false);
export const MIN_WORK = 3;
