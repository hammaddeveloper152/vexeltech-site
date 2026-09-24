import { useEffect } from 'react';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
const pageMeta={
	'About Us':{title:'About VexelTech Solutions | Startup Web Design Agency',description:'A small team in Richmond, TX building brand, web, marketing and automation for founders.'},
	'Portfolio':{title:'Startup & Small Business Website Case Studies',description:'Before, built and after, for every project. Real work, clear deliverables and the outcome each project was built to create.'},
	'Packages & Pricing':{title:'Website Design Pricing for Startups | VexelTech',description:'What a startup website actually costs, with the number on the page. No discovery-call theatre, no quote-on-request, no surprises.'},
	'Contact Us':{title:'Contact VexelTech | Book a 15-Minute Call',description:'Book a 15-minute call, request a callback, or ring us. We come back with the fix built, not a proposal.'}
};
export default function SecondaryLayout({ children, title, description }) {
  useEffect(() => {
    const metaInfo = pageMeta[title];
    document.title = metaInfo?.title || (title ? `${title} | VexelTech Solutions` : 'VexelTech Solutions');
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description || metaInfo?.description || 'Flat prices for US local service businesses. Websites $700, branding from $299, live in four business days. You see the work before you owe anything.';

    const onScroll = () => document.body.classList.toggle('inner-page--scrolled', window.scrollY > 420);
    document.body.classList.add('inner-page');
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.scrollTo(0, 0);

    // Stagger reveal entrance animation for secondary page elements
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll('.secondary-page .band, .secondary-page .gcard, .secondary-page .sig, .secondary-page .h-xl, .secondary-page .h-lg');
      if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        targets.forEach((el) => {
          if (!el.dataset.revealed) {
            el.dataset.revealed = 'true';
            window.gsap.fromTo(
              el,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      }
    }, 80);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('inner-page', 'inner-page--scrolled');
      window.removeEventListener('scroll', onScroll);
    };
  }, [title, description]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main className="secondary-page" data-page={title?.toLowerCase().replace(/[^a-z]+/g, '-')} id="main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
