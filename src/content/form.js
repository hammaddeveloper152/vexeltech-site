/* WHERE THE QUOTE FORM POSTS (the founder's final audit, final22,
   2026-10-06). The site is hosted on Hostinger, where Netlify Forms does not
   run, so the form posts to Formspree by default.

     VITE_FORMSPREE_ID   the Formspree form ID (formspree.io/f/<ID>). Until
                         it is set the endpoint is the placeholder below, and
                         a submission fails cleanly into the error state.
     VITE_FORM_TARGET    "netlify" posts the old Netlify form "contact" to
                         "/" and keeps its hidden twin in index.html, for a
                         later move back to Netlify. Anything else, or unset,
                         is Formspree, and the build strips the twin
                         (vite.config.js, `netlifyFormTwin`).

   Set both in a `.env` file at the repo root before `npm run build`. */
export const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || 'YOUR_FORMSPREE_ID';
export const FORM_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;
export const FORM_TARGET = import.meta.env.VITE_FORM_TARGET === 'netlify' ? 'netlify' : 'formspree';
export const FORM_EMAIL = 'info@vexeltechsolutions.com';
