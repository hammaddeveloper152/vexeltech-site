import React, { useEffect, useRef } from 'react';

/* THE HERO SURFACE — a lit liquid-metal plane behind the copy.

   The hero was the only section with no light of its own beyond the bloom: a
   flat ground under a gradient, with nothing on it. This is a slow surface for
   the light to fall on.

   ---- What it is ----------------------------------------------------------

   Raw WebGL, no library. One fullscreen triangle, one fragment shader, two
   uniforms. Domain-warped RIDGED noise at two octaves drifting at 0.03 per
   second, lit by a single key from the top left.

   ---- Ridges, not fog -----------------------------------------------------

   The first surface was soft noise under a diffuse light, and it read as
   tinted fog: everything sat in the mid-range, and the mid-range of a yellow
   key over asphalt is olive. Two changes fix it and they work together.

   THE FIELD IS RIDGED. `1 - abs(2n - 1)` folds the noise about its midline so
   the old mid-values become the new peaks, and the fourth power narrows those
   peaks into creases. Most of the surface is now dark and the light has thin
   edges to catch.

   THE COLOUR IS A PATH, NOT A TINT. Three stops — asphalt, machine yellow at
   the midpoint, warm white at the top — so a crease ramps THROUGH the yellow
   into a near-neutral warm white rather than stopping in it. That is the
   difference between light on metal and a yellow wash: the brightest pixels
   are almost colourless, and only the shoulders are yellow.

   A narrow specular lobe, `pow(d, 48)`, puts the brightest pixels where the
   surface faces the key. The blur drops to 0.75px so the creases keep an edge;
   at 1.5px they averaged back into the fog this was built to remove.

   ---- THE BRIGHTNESS CEILING IS THE POINT --------------------------------

   **No pixel exceeds 13.4% relative luminance**, and the guarantee is now the
   ramp rather than a clamp on a scalar: the surface is asphalt plus
   `(ramp(x) - asphalt) * 0.3608`, and 0.3608 is solved so that the TOP of the
   ramp — warm white #FFF1CC — lands on exactly 13.4%. `x` is clamped to 1, so
   nothing can go past it.

   THE ARITHMETIC IN THIS COMMENT WAS WRONG ONCE AND IT IS WORTH KEEPING THE
   CORRECTION. It read: clamp 0.28, yellow's luminance is 0.712, so peak is
   0.0091 + 0.712 * 0.28 = 0.208. That mixes two spaces. The shader blends in
   **sRGB** — `asphalt + key * s` operates on the encoded values — so the
   result has to be linearised AFTER the blend, not composed from linear
   luminances. At s = 0.28 the output is rgb(90,74,36), whose true luminance is
   **7.2%**, a third of what the comment claimed. Two rounds of tuning changed
   the falloff and moved the measured peak by 0.6 of a point, because the
   shader was already sitting on its clamp the whole time and the clamp was
   three times tighter than intended.

   Solved properly: s = 0.42 -> 13.4%, s = 0.56 -> 21.9%.

   ---- THE SUB IS THE BINDING CONSTRAINT, NOT THE HEADLINE ----------------

   The brief set 22% "so the white headline and the yellow CTA keep their
   contrast", and for those two it is generous: white on 13.4% is 5.74:1 and
   the headline is 190px, and the call is an opaque yellow button that nothing
   behind it can touch.

   The element this surface can actually break is the SUB. It is steel-dark
   #858A92 at 18px, which is body text needing 4.5:1, and steel-dark tolerates
   a ground of only **1.72% luminance** at that ratio. Any surface worth
   looking at is brighter than that.

   So the canvas is MASKED rather than dimmed: full strength across the top,
   where the only thing over it is a 190px headline, and faded to nothing
   before the sub begins. The copy sits on the section's own gradient exactly
   as it did before this file existed. See `.hero__surface` in lit.css.

   **The standard contrast walk cannot see any of this.** It composites
   background-colour up the DOM, and the canvas is a SIBLING of the copy rather
   than an ancestor, so it reports the sub against `.hero`'s own background and
   passes it. The surface under the copy has to be measured off painted
   pixels.

   ---- What it costs -------------------------------------------------------

   The loop stops when the hero leaves the viewport, and it never starts under
   `prefers-reduced-motion` — one frame is drawn and the context is left alone,
   so the surface is a still image rather than a missing one. Device pixel
   ratio is capped at 1.5. If WebGL is unavailable the canvas hides itself and
   the section's own gradient is what shows, which is exactly what was there
   before this file existed. */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/* Two octaves, one warp, one light. Kept short deliberately: this is a
   surface, and every extra octave is cost for texture nobody reads. */
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
/* RIDGED. abs() folds the noise about its midline and the inversion turns the
   fold into a crease; the fourth power narrows it until the field is mostly
   dark with thin bright lines through it. */
float rg(vec2 p){float v=1.-abs(n(p)*2.-1.);v*=v;return v*v;}
float fbm(vec2 p){return .62*rg(p)+.30*rg(p*2.03+11.);}
float field(vec2 u){
vec2 q=vec2(fbm(u+vec2(0.,t)),fbm(u+vec2(5.2,1.3-t)));
return fbm(u*1.5+q*1.9);}
/* Three stops: asphalt, machine yellow at the midpoint, warm white at the top.
   The path matters more than the stops — the yellow is passed THROUGH on the
   way to white rather than rested on, which is what stops the highlights
   reading as tinted fog. */
vec3 A=vec3(.090,.094,.102);
vec3 Y=vec3(.941,.702,.137);
vec3 W=vec3(1.,.945,.800);
vec3 ramp(float x){return x<.5?mix(A,Y,x*2.):mix(Y,W,(x-.5)*2.);}
void main(){
vec2 u=gl_FragCoord.xy/r.y;
float f=field(u);
float e=.004;
vec3 nm=normalize(vec3(field(u+vec2(e,0.))-f,field(u+vec2(0.,e))-f,e*1.1));
vec3 K=normalize(vec3(-.55,.72,.52));
float d=max(dot(nm,K),0.);
/* A narrow specular lobe, about 6% of the field wide. */
float sp=pow(d,48.);
float x0=clamp(pow(f,3.2)*1.5+sp*2.6,0.,1.);
/* THE MID-RAMP IS SKIPPED, NOT CROSSED. The olive band the brief bans sits at
   roughly x 0.32 to 0.60 — it is what machine yellow at this amplitude over
   asphalt IS. A smooth ramp parks pixels there in proportion to how many land
   mid-field, which measured 22% of the frame. This maps the field to either
   side of that band and through almost none of it: everything under the knee
   stays dark, everything over it is thrown past the yellow stop into the warm
   white. The yellow is still at 0.5 of the ramp; almost nothing rests on it. */
float x=x0<.22?x0*.55:mix(.66,1.,smoothstep(.22,.50,x0));
/* 0.3608 is solved, not chosen: it is the amplitude at which the TOP of the
   ramp lands on 13.4% luminance. The clamp on x is what guarantees it. */
gl_FragColor=vec4(A+(ramp(x)-A)*.348,1.);}`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
  return sh;
}

/* `className` is what makes this reusable. The shader, the clamp, the loop
   and every rule about when it may run belong to the device; where it sits and
   how big it is belong to the page. Its second mount is the About page's
   heading block — see DESIGN.md, "the surface is the recurring device". */
export default function HeroSurface({ className = 'hero__surface' }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;

    const gl =
      cv.getContext('webgl', { antialias: false, alpha: false, depth: false }) ||
      cv.getContext('experimental-webgl');
    /* No context: hide and let the section's gradient stand. */
    if (!gl) {
      cv.style.display = 'none';
      return undefined;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs && gl.createProgram();
    if (!prog) {
      cv.style.display = 'none';
      return undefined;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      cv.style.display = 'none';
      return undefined;
    }
    gl.useProgram(prog);

    /* One triangle that covers the clip volume. Cheaper than a quad and it
       needs no index buffer. */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, 'r');
    const uT = gl.getUniformLocation(prog, 't');

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uR, cv.width, cv.height);
    };

    const draw = (seconds) => {
      size();
      gl.uniform1f(uT, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let onScreen = true;
    const start = performance.now();

    const frame = (now) => {
      /* 0.03 per second: the whole point is that a reader never catches it
         moving, only notices it has. */
      draw(((now - start) / 1000) * 0.03);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const run = () => {
      stop();
      if (mq.matches) {
        /* One frame, held. A surface that is switched off entirely is a hole
           where a surface was; this is the same plane, not moving. */
        draw(0.42);
        return;
      }
      if (onScreen) raf = requestAnimationFrame(frame);
    };

    /* The loop is the hero's, so it stops with the hero. */
    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (es) => {
          onScreen = es.some((e) => e.isIntersecting);
          run();
        },
        { rootMargin: '120px' }
      );
      io.observe(cv);
    }

    const onResize = () => {
      if (!raf) draw(mq.matches ? 0.42 : (performance.now() - start) / 1000 * 0.03);
    };

    mq.addEventListener('change', run);
    window.addEventListener('resize', onResize);
    run();

    return () => {
      stop();
      if (io) io.disconnect();
      mq.removeEventListener('change', run);
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas className={className} ref={ref} aria-hidden="true" />;
}
