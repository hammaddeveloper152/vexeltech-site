/* Scope the legacy stylesheet.

   BUILD-LAW.md pre-flight step 12: `styles.css` is 9,960 unscoped lines that
   `main.jsx` imports globally, and it opens with bare-element resets. Nothing
   can serve the rebuild at `/` while that is true.

   Every selector is rewritten to require an ancestor (or self) carrying the
   scope class. The four root-level selectors collapse ONTO the scope element
   itself, because a wrapper div is what `html`, `body` and `:root` are now:

     :root  -> .lg          the legacy custom properties, off the rebuild
     html   -> .lg
     body   -> .lg
     *      -> .lg, .lg *   the reset, including the wrapper

   @font-face and @keyframes stay at the top level; keyframe names were
   checked for collisions against the rebuild and there are none.  */
import fs from 'node:fs';
import postcss from 'postcss';

const SCOPE = '.lg';
const src = fs.readFileSync('src/styles.css', 'utf8');

const stats = { rules: 0, selectors: 0, root: 0, dropped: [] };

/* One selector at a time. Returns null to drop it. */
function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return null;

  /* Bare universal reset. */
  if (s === '*') { stats.root += 1; return `${SCOPE}, ${SCOPE} *`; }
  if (/^\*::(before|after)$/.test(s)) { stats.root += 1; return `${SCOPE}::${RegExp.$1}, ${SCOPE} *::${RegExp.$1}`; }

  /* Root-level elements become the scope element itself, keeping any
     class or state qualifier that was attached to them:
       html.g-wait .rv   -> .lg.g-wait .rv
       body.dark-top .nav -> .lg.dark-top .nav  */
  const rootRe = /^(html|body|:root)\b/;
  if (rootRe.test(s)) {
    stats.root += 1;
    return s.replace(rootRe, SCOPE);
  }

  /* A descendant selector that merely starts from html/body loses nothing
     by being reparented, and everything else is prefixed. */
  return `${SCOPE} ${s}`;
}

const scoped = {
  postcssPlugin: 'scope-legacy',
  Once(root) {
        root.walkRules((rule) => {
          /* Keyframe steps (0%, from, to) are not selectors. */
          const p = rule.parent;
          if (p && p.type === 'atrule' && /keyframes$/i.test(p.name)) return;
          stats.rules += 1;
          const out = rule.selectors.map(scopeSelector).filter(Boolean);
          stats.selectors += out.length;
          if (!out.length) { stats.dropped.push(rule.selector); rule.remove(); return; }
          rule.selectors = out;
        });
  },
};

const result = await postcss([scoped]).process(src, { from: 'src/styles.css', to: 'src/styles.legacy.css' });

const header = `/* GENERATED — do not edit. Source: src/styles.css
   Scoped by .measure/scope-legacy.mjs so the legacy stylesheet cannot reach
   the rebuilt pages. See BUILD-LAW.md pre-flight step 12.
   Regenerate:  node .measure/scope-legacy.mjs
*/\n`;

fs.writeFileSync('src/styles.legacy.css', header + result.css);
console.log(JSON.stringify({ ...stats, bytesIn: src.length, bytesOut: result.css.length }, null, 1));
