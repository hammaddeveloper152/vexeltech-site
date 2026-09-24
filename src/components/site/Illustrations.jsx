import React from 'react';

/* THE CARD ILLUSTRATIONS, 2026-09-24 (the founder's illustration pass; the
   isometric outline style of coinsetters.io's services section, translated
   to this palette). They are the card's artwork on home's What we do and
   About's What we build it around.

   TRUE ISOMETRIC, 30 degree axes: a point (x, y, z) lands at
   (x - y) * cos 30, (x + y) * sin 30 - z. The geometry is generated, not
   hand-placed, so the light is the same on all four: TOP lit-raised, LEFT
   lit-near, RIGHT steel-dark. The keyline is bone at 1.5px with round joins,
   the sound arcs and connectors 2px (ArtCard.css).

   THE SECOND ITERATION, later on 2026-09-24 (the founder): the objects float
   - no base plates, no shadows - and each is scaled so its larger dimension
   fills 124px of the 140px slot, centred. Each has exactly one yellow
   element:

     Branding     a stamp block with a raised V on its top face (kept); the V
     Websites     a browser lying flat like a tablet, 3:2, three dots, a wide
                  bar, a narrow bar; the block
     Marketing    a megaphone, a small cylinder widening to an open elliptical
                  mouth, angled 30 degrees up the iso axis, the handle under
                  it, three sound arcs; the middle arc
     Automation   three 32-unit cubes on the iso axis with 12-unit gaps,
                  joined along their top edges by connectors with a dot at
                  each join; the last cube

   Decorative: the card's title says what each one is. */

export function IsoBranding({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M16.0 169.9 L140.0 241.5 L140.0 181.7 L16.0 110.1Z" />
      <path className="iso-r" d="M264.0 169.9 L140.0 241.5 L140.0 181.7 L264.0 110.1Z" />
      <path className="iso-t" d="M140.0 38.5 L264.0 110.1 L140.0 181.7 L16.0 110.1Z" />
      <path className="iso-l" d="M114.1 136.7 L93.8 125.0 L93.8 113.3 L114.1 125.0Z" />
      <path className="iso-r" d="M212.1 112.7 L114.1 136.7 L114.1 125.0 L212.1 101.0Z" />
      <path className="iso-l" d="M93.8 125.0 L135.5 68.4 L135.5 56.7 L93.8 113.3Z" />
      <path className="iso-y" d="M135.5 56.7 L155.8 68.4 L131.0 103.6 L191.9 89.2 L212.1 101.0 L114.1 125.0 L93.8 113.3Z" />
    </svg>
  );
}

export function IsoWebsites({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M16.0 131.4 L164.8 217.3 L164.8 205.9 L16.0 120.0Z" />
      <path className="iso-r" d="M264.0 160.0 L164.8 217.3 L164.8 205.9 L264.0 148.6Z" />
      <path className="iso-t" d="M115.2 62.7 L264.0 148.6 L164.8 205.9 L16.0 120.0Z" />
      <path className="iso-line" d="M97.8 72.7 L246.6 158.6" />
      <path className="iso-d" d="M120.2 71.3 L125.1 74.1 L117.7 78.4 L112.7 75.6Z" />
      <path className="iso-d" d="M130.1 77.0 L135.0 79.9 L127.6 84.2 L122.6 81.3Z" />
      <path className="iso-d" d="M140.0 82.7 L145.0 85.6 L137.5 89.9 L132.6 87.0Z" />
      <path className="iso-t" d="M100.3 85.6 L211.9 150.0 L204.5 154.3 L92.9 89.9Z" />
      <path className="iso-t" d="M85.4 94.2 L147.4 130.0 L140.0 134.3 L78.0 98.5Z" />
      <path className="iso-y" d="M68.1 104.2 L122.6 135.7 L95.4 151.5 L40.8 120.0Z" />
    </svg>
  );
}

export function IsoMarketing({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M44.5 206.5 L60.2 215.6 L60.2 176.2 L44.5 167.1Z" />
      <path className="iso-r" d="M76.0 206.5 L60.2 215.6 L60.2 176.2 L76.0 167.1Z" />
      <path className="iso-t" d="M60.2 158.0 L76.0 167.1 L60.2 176.2 L44.5 167.1Z" />
      <path className="iso-r" d="M16.0 155.7 L16.2 153.3 L16.7 151.0 L17.5 148.8 L18.4 146.7 L19.6 144.9 L20.9 143.2 L22.4 141.8 L24.1 140.7 L25.9 139.8 L27.7 139.3 L29.6 139.1 L56.9 136.6 L58.8 136.7 L60.7 137.1 L62.6 137.8 L64.4 138.8 L66.0 140.1 L67.6 141.7 L68.9 143.5 L70.1 145.4 L71.1 147.6 L71.8 149.9 L72.3 152.2 L72.6 154.6 L72.6 157.1 L72.4 159.4 L71.9 161.8 L71.2 164.0 L70.2 166.0 L69.0 167.9 L67.7 169.5 L66.2 171.0 L64.5 172.1 L62.8 172.9 L60.9 173.5 L59.0 173.7 L31.7 176.1 L29.8 176.0 L27.9 175.6 L26.0 174.9 L24.2 173.9 L22.6 172.6 L21.0 171.1 L19.7 169.3 L18.5 167.3 L17.5 165.2 L16.8 162.9 L16.3 160.5 L16.0 158.1Z" />
      <path className="iso-l" d="M40.4 152.9 L40.7 150.0 L41.2 147.2 L42.1 144.6 L43.3 142.1 L44.6 139.9 L46.3 137.9 L48.1 136.2 L104.0 88.3 L110.3 83.9 L117.1 80.7 L124.1 78.7 L131.3 77.8 L138.6 78.1 L145.9 79.7 L152.9 82.4 L159.7 86.2 L166.0 91.1 L171.9 97.0 L177.0 103.8 L181.5 111.3 L185.2 119.4 L188.0 128.1 L190.0 137.1 L191.0 146.2 L191.0 155.5 L190.1 164.5 L188.2 173.4 L185.5 181.7 L181.9 189.5 L177.5 196.6 L172.3 202.9 L166.6 208.3 L160.3 212.6 L153.5 215.8 L146.5 217.8 L139.3 218.7 L132.0 218.4 L124.7 216.8 L117.7 214.1 L110.9 210.3 L50.2 174.7 L48.2 173.2 L46.4 171.3 L44.8 169.2 L43.4 166.8 L42.2 164.3 L41.3 161.5 L40.7 158.7 L40.4 155.8Z" />
      <path className="iso-t" d="M85.4 177.1 L82.6 168.4 L80.6 159.4 L79.6 150.3 L79.6 141.1 L80.5 132.0 L82.4 123.2 L85.1 114.8 L88.7 107.0 L93.1 99.9 L98.3 93.6 L104.0 88.3 L110.3 83.9 L117.1 80.7 L124.1 78.7 L131.3 77.8 L138.6 78.1 L145.9 79.7 L152.9 82.4 L159.7 86.2 L166.0 91.1 L171.9 97.0 L177.0 103.8 L181.5 111.3 L185.2 119.4 L188.0 128.1 L190.0 137.1 L191.0 146.2 L191.0 155.5 L190.1 164.5 L188.2 173.4 L185.5 181.7 L181.9 189.5 L177.5 196.6 L172.3 202.9 L166.6 208.3 L160.3 212.6 L153.5 215.8 L146.5 217.8 L139.3 218.7 L132.0 218.4 L124.7 216.8 L117.7 214.1 L110.9 210.3 L104.6 205.4 L98.7 199.5 L93.5 192.7 L89.1 185.2Z" />
      <path className="iso-l" d="M95.9 171.0 L93.7 164.2 L92.1 157.1 L91.4 149.8 L91.3 142.6 L92.0 135.4 L93.5 128.4 L95.7 121.8 L98.5 115.7 L102.0 110.0 L106.1 105.1 L110.6 100.9 L115.6 97.5 L120.9 94.9 L126.5 93.3 L132.2 92.6 L137.9 92.9 L143.7 94.1 L149.2 96.3 L154.6 99.3 L159.6 103.2 L164.2 107.8 L168.3 113.1 L171.8 119.1 L174.7 125.5 L176.9 132.3 L178.5 139.4 L179.2 146.7 L179.3 153.9 L178.5 161.1 L177.1 168.1 L174.9 174.7 L172.1 180.9 L168.6 186.5 L164.5 191.4 L160.0 195.6 L155.0 199.0 L149.7 201.6 L144.1 203.2 L138.4 203.9 L132.7 203.6 L126.9 202.4 L121.4 200.2 L116.0 197.2 L111.0 193.3 L106.4 188.7 L102.3 183.4 L98.8 177.4Z" />
      <path className="iso-arc" d="M221.8 205.2 L222.0 199.3 L221.9 193.4 L221.5 187.2 L220.8 180.9 L219.8 174.5 L218.5 168.0 L216.9 161.4 L215.0 154.8 L212.8 148.2 L210.4 141.5 L207.7 134.9 L204.7 128.4 L201.5 121.9 L198.1 115.5 L194.4 109.2 L190.6 103.0 L186.5 97.0 L182.3 91.2 L177.9 85.6 L173.3 80.2" />
      <path className="iso-arc iso-arc--y" d="M242.7 219.0 L243.0 211.7 L242.9 204.3 L242.4 196.6 L241.5 188.8 L240.2 180.9 L238.6 172.8 L236.6 164.6 L234.3 156.4 L231.6 148.2 L228.6 139.9 L225.2 131.7 L221.5 123.5 L217.6 115.5 L213.3 107.5 L208.7 99.7 L203.9 92.1 L198.9 84.6 L193.6 77.4 L188.2 70.4 L182.5 63.7" />
      <path className="iso-arc" d="M263.7 232.7 L264.0 224.1 L263.9 215.2 L263.3 206.1 L262.2 196.7 L260.7 187.2 L258.8 177.6 L256.4 167.8 L253.6 158.0 L250.4 148.2 L246.8 138.3 L242.8 128.5 L238.4 118.7 L233.6 109.1 L228.5 99.6 L223.1 90.2 L217.3 81.1 L211.3 72.2 L205.0 63.6 L198.5 55.3 L191.7 47.3" />
    </svg>
  );
}

export function IsoAutomation({ className }) {
  return (
    <svg className={className} viewBox="0 0 280 280" width="140" height="140" aria-hidden="true" focusable="false">
      <path className="iso-l" d="M16.0 128.7 L68.2 158.8 L68.2 98.6 L16.0 68.4Z" />
      <path className="iso-r" d="M120.4 128.7 L68.2 158.8 L68.2 98.6 L120.4 68.4Z" />
      <path className="iso-t" d="M68.2 38.3 L120.4 68.4 L68.2 98.6 L16.0 68.4Z" />
      <path className="iso-arc" d="M94.3 83.5 L113.9 94.8" />
      <circle className="iso-dot" cx="94.3" cy="83.5" r="3" />
      <circle className="iso-dot" cx="113.9" cy="94.8" r="3" />
      <path className="iso-l" d="M87.8 170.1 L140.0 200.3 L140.0 140.0 L87.8 109.9Z" />
      <path className="iso-r" d="M192.2 170.1 L140.0 200.3 L140.0 140.0 L192.2 109.9Z" />
      <path className="iso-t" d="M140.0 79.7 L192.2 109.9 L140.0 140.0 L87.8 109.9Z" />
      <path className="iso-arc" d="M166.1 124.9 L185.7 136.2" />
      <circle className="iso-dot" cx="166.1" cy="124.9" r="3" />
      <circle className="iso-dot" cx="185.7" cy="136.2" r="3" />
      <path className="iso-y" d="M159.6 211.6 L211.8 241.7 L211.8 181.4 L159.6 151.3Z" />
      <path className="iso-y" d="M264.0 211.6 L211.8 241.7 L211.8 181.4 L264.0 151.3Z" />
      <path className="iso-y" d="M211.8 121.2 L264.0 151.3 L211.8 181.4 L159.6 151.3Z" />
    </svg>
  );
}

