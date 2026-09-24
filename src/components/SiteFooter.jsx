/* THE VEXEL SCALES LINES ARE REMOVED, 2026-09-08.

   This footer renders on EVERY legacy page, and it carried two references:
   an entity line, "Vexel Scales LLC", above the address, and a parent
   company line in the legal row, "a Vexel Scales LLC brand".

   CLAUDE.md records, under "Settled and not to be revisited": no Vexel
   Scales attribution, parent company line, or reference of any kind appears
   anywhere on the site, decided by the user directly. That decision has been
   in the document the whole build while this component printed it on every
   legacy route. Removing it applies the record rather than making a call;
   the same string came out of index.html's JSON-LD on the route swap for the
   same reason.

   The Richmond address stays. It is not a Vexel Scales reference. It is,
   separately, an unverified contact detail that the rebuilt footer
   deliberately refuses to print, and that question is open. */
import { Link } from 'react-router-dom';
export default function SiteFooter(){return <><footer className="foot"><div className="wrap"><div className="foot-g"><div><Link className="brand" to="/"><span className="brand-tile"><svg viewBox="0 0 100 100" aria-hidden="true"><path className="mk" d="M7 33 29 25 50 60 78 6 94 2 54 93Z"/></svg></span>vexeltech</Link><p>Branding, websites, marketing and automation for startups, SMBs and founders. We show up with it built.</p></div><div><h3 className="foot-h">Services</h3><ul><li><Link to="/services/branding">Branding</Link></li><li><Link to="/services/websites">Websites</Link></li><li><Link to="/services/marketing">Marketing</Link></li><li><Link to="/services/automation">Automation</Link></li></ul></div><div><h3 className="foot-h">Explore</h3><ul><li><Link to="/about-us">About us</Link></li><li><Link to="/packages">Pricing</Link></li></ul></div><div><h3 className="foot-h">Contact</h3><ul><li><Link to="/contact-us">Contact us</Link></li><li><a href="tel:+13852843265">(385) 284-3265</a></li><li><a href="mailto:info@vexeltechsolutions.com">info@vexeltechsolutions.com</a></li><li>Richmond, TX 77406, USA</li></ul></div></div><div className="foot-legal"><span>© 2026 VexelTech Solutions</span><span><Link to="/privacy-policy">Privacy</Link> · <Link to="/terms-of-service">Terms</Link></span></div></div></footer><div className="sticky"><Link className="btn btn--go" to="/contact-us">Book a Discovery Call</Link></div></>}
