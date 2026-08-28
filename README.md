# VexelTech React

React/Vite conversion of the supplied VexelTech site.

## Important homepage preservation
The original homepage source is preserved in `src/legacy/original-index.html`.
Its exact body markup, original inline scripts, and original CSS are stored in:

- `src/legacy/home-body.html`
- `src/legacy/home-scripts.js`
- `src/styles.css`

`HomePage.jsx` mounts that original markup and executes the original motion layer after the DOM is mounted. This is intentional: the homepage interactions should not be redesigned or simplified.

## Run
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npm run preview
```

## Deployment
Netlify is configured to build with `npm run build`, publish `dist`, and route SPA URLs back to `index.html`.
