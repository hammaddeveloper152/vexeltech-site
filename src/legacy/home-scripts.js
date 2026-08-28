
document.documentElement.classList.add('js');
var serviceOrder = ['branding', 'websites', 'marketing', 'automation'];
function orderServices(parent, selector) {
  var nodes = [].slice.call(parent.querySelectorAll(selector));
  nodes.sort(function (a, b) { return serviceOrder.indexOf(a.dataset.service) - serviceOrder.indexOf(b.dataset.service) });
  nodes.forEach(function (node) { node.parentNode.appendChild(node) });
}
orderServices(document, '#proofRows .row');
orderServices(document, '.pm-art');
orderServices(document, '.dxq .dxo');
orderServices(document, '.dxa .dxr');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }) }, { threshold: .06, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
} else { document.querySelectorAll('.rv').forEach(el => el.classList.add('in')) }
(function () {
  var rows = document.querySelectorAll('#proofRows .row'), v = document.getElementById('pmV'), d = document.getElementById('pmD');
  if (!rows.length || !v) return;
  var i = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var arts = document.querySelectorAll('.pm-art'), dots = document.querySelectorAll('.pm-dots i');
  function show(n) {
    rows.forEach(function (r, k) { r.classList.toggle('is-on', k === n) });
    arts.forEach(function (a, k) { a.classList.toggle('is-on', k === n) });
    dots.forEach(function (x, k) { x.classList.toggle('is-on', k === n) });
    v.textContent = rows[n].dataset.w; d.textContent = rows[n].dataset.d;
    if (window.gsap && !reduce && arts[n]) {
      gsap.fromTo(arts[n].firstElementChild, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' });
      gsap.fromTo(v, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' });
    }
  }
  show(0);
  if (reduce) return;
  var timer = setInterval(function () { i = (i + 1) % rows.length; show(i) }, 3600);
  rows.forEach(function (r, k) { r.addEventListener('mouseenter', function () { clearInterval(timer); i = k; show(k) }) });
})();
(function () {
  /* nav active state via scroll position */
  var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (links.length) {
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')) }).filter(Boolean);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current') });
        var m = links.filter(function (a) { return a.getAttribute('href') === '#' + e.target.id })[0];
        if (m) m.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (x) { io.observe(x) });
  }
  /* form submit feedback */
  var fm = document.querySelector('form.form');
  if (fm) { fm.addEventListener('submit', function () { fm.classList.add('is-sending'); }); }
})();

/* ══ Pinned services + marquee ═══════════════════════════════ */
function vexelPin() {
  var sec = document.querySelector('.pin'); if (!sec || !window.gsap) return;
  orderServices(sec, '.pin-slide');
  orderServices(sec, '.pin-fig');
  orderServices(sec, '.pin-rail button');
  var slides = [].slice.call(sec.querySelectorAll('.pin-slide')),
    figs = [].slice.call(sec.querySelectorAll('.pin-fig')),
    btns = [].slice.call(sec.querySelectorAll('.pin-rail button')),
    num = document.getElementById('pinNum'), rail = sec.querySelector('.pin-rail'), cur = -1;
  btns.forEach(function (button, k) {
    var index = button.querySelector('i');
    if (index) index.textContent = '0' + (k + 1);
  });

  function fitRail() {
    if (!rail || window.innerWidth < 941 || cur < 0) return;
    var stage = sec.querySelector('.pin-stage').getBoundingClientRect(),
      visual = figs[cur].firstElementChild,
      tags = slides[cur].querySelector('.pin-tags'),
      bottom = Math.max(visual ? visual.getBoundingClientRect().bottom : 0, tags ? tags.getBoundingClientRect().bottom : 0),
      max = stage.height - rail.offsetHeight - 8,
      top = Math.min(Math.max(bottom - stage.top + 32, 0), max);
    rail.style.top = top + 'px';
    rail.style.bottom = 'auto';
  }

  function go(i) {
    if (i === cur) return; cur = i;
    gsap.killTweensOf(slides); gsap.killTweensOf(figs);
    slides.forEach(function (e) { gsap.set(e, { clearProps: 'all' }) });
    figs.forEach(function (e) { gsap.set(e, { clearProps: 'all' }) });
    [slides, figs, btns].forEach(function (g) { g.forEach(function (e, k) { e.classList.toggle('is-on', k === i) }) });
    if (num) num.textContent = '0' + (i + 1);
    fitRail();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(slides[i], { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
      gsap.fromTo(figs[i], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' });
      gsap.fromTo(slides[i].querySelectorAll('.pin-tags span'), { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: .4, stagger: .035, ease: 'power2.out', delay: .12 });
      playArtifact(i, figs[i]);
      gsap.delayedCall(1.05, fitRail);
    }
  }

  /* ── each artifact plays its own story on entry ───────────── */
  function count(el, to, dur) {
    if (!el) return; var o = { v: 0 };
    gsap.to(o, {
      v: to, duration: dur || 1.1, ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(o.v) }
    });
  }
  function playArtifact(i, fig) {
    var tl = gsap.timeline({ delay: .18 });
    var service = fig.dataset.service;
    if (service === 'websites') {
      tl.fromTo(fig.querySelector('.brw'), { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' })
        .fromTo(fig.querySelectorAll('.mk-h, .mk-p, .mk-btns'), { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: .35, stagger: .07 }, '-=.3')
        .fromTo(fig.querySelectorAll('.mk-strip div'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, stagger: .05 }, '-=.2')
        .fromTo(fig.querySelectorAll('.mk-card'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .35, stagger: .07 }, '-=.15')
        .fromTo(fig.querySelector('.shw-ph'), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.4')
        .fromTo(fig.querySelector('.shw-note'), { opacity: 0 }, { opacity: 1, duration: .4 }, '-=.2');
    }
    if (service === 'marketing') {
      tl.fromTo(fig.querySelectorAll('.adc'), { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: .5, stagger: .13, ease: 'power3.out' })
        .fromTo(fig.querySelector('.ads-foot'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45 }, '-=.2')
        .fromTo(fig.querySelector('.adc-k'), { opacity: 0 }, { opacity: 1, duration: .35 }, '-=.5');
    }
    if (service === 'automation') {
      tl.fromTo(fig.querySelector('.au-ph'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' })
        .fromTo(fig.querySelectorAll('.au-step'), { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: .32, stagger: .26, ease: 'power2.out' }, '-=.2')
        .fromTo(fig.querySelectorAll('.au-side > *'), { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: .45, stagger: .12, ease: 'power3.out' }, '-=1.1');
      count(fig.querySelector('.au-n'), 38, 1.6);
    }
    if (service === 'branding') {
      tl.fromTo(fig.querySelector('.idn-veh'), { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' })
        .fromTo(fig.querySelectorAll('.idn-row > *'), { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: .45, stagger: .1, ease: 'power3.out' }, '-=.25')
        .fromTo(fig.querySelector('.idn-inv'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }, '-=.25')
        .fromTo(fig.querySelectorAll('.idn-cap, .idn-note'), { opacity: 0 }, { opacity: 1, duration: .4, stagger: .08 }, '-=.2');
    }
  }

  go(0);
  var autoTimer = null;
  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      var n = slides.length;
      go((cur + 1) % n);
    }, 4200);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  btns.forEach(function (b, k) {
    b.addEventListener('click', function () {
      stopAuto();
      go(k);
    });
  });

  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: startAuto,
      onEnterBack: startAuto,
      onLeave: stopAuto,
      onLeaveBack: stopAuto
    });
  }
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', vexelPin); } else { vexelPin(); }


/* ══ Two ways in — illustrated reveal ════════════════════════ */
function vexelPaths() {
  var sec = document.querySelector('.paths'); if (!sec || !window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 74%' } });
    tl.from(sec.querySelectorAll('.pa'), { opacity: 0, duration: .5, stagger: .12, ease: 'power2.out' })
      .from(sec.querySelectorAll('.f1-brw'), { opacity: 0, y: 22, duration: .55, ease: 'power3.out' }, '-=.2')
      .from(sec.querySelectorAll('.f1-hero b, .f1-cta'), { opacity: 0, y: 8, duration: .3, stagger: .07 }, '-=.25')
      .from(sec.querySelectorAll('.f1-strip b'), { opacity: 0, y: 6, duration: .25, stagger: .04 }, '-=.15')
      .from(sec.querySelectorAll('.f1-cards i'), { opacity: 0, y: 8, duration: .28, stagger: .05 }, '-=.12')
      .from(sec.querySelector('.f1-ph'), { opacity: 0, y: 26, duration: .5, ease: 'power3.out' }, '-=.3')
      .from(sec.querySelector('.f2-ad'), { opacity: 0, x: -20, duration: .45, ease: 'power3.out' }, '-=.85')
      .from(sec.querySelector('.f2-msg'), { opacity: 0, x: 20, duration: .45, ease: 'power3.out' }, '-=.28')
      .from(sec.querySelector('.f2-truck'), { opacity: 0, y: 22, duration: .45, ease: 'power3.out' }, '-=.28')
      .from(sec.querySelector('.f2-map'), { opacity: 0, y: 22, duration: .45, ease: 'power3.out' }, '-=.3')
      .from(sec.querySelectorAll('.f1-cap, .f2-cap'), { opacity: 0, duration: .35, stagger: .06 }, '-=.2');
  });
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', vexelPaths); } else { vexelPaths(); }


/* ══ Case study slider ═══════════════════════════════════════ */
function vexelCases() {
  var box = document.getElementById('csSlider'); if (!box) return;
  var slides = [].slice.call(box.querySelectorAll('.cs-slide')),
    btns = [].slice.call(box.querySelectorAll('.cs-rail button')),
    prev = document.getElementById('csPrev'), next = document.getElementById('csNext'),
    i = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(n) {
    n = (n + slides.length) % slides.length; i = n;
    slides.forEach(function (e, k) { e.classList.toggle('is-on', k === n) });
    btns.forEach(function (e, k) { e.classList.toggle('is-on', k === n) });
    if (window.gsap && !reduce) {
      var sl = slides[n];
      gsap.fromTo(sl.querySelector('.cs-l'), { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45, ease: 'power3.out' });
      gsap.fromTo(sl.querySelector('.cs-mock'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
      gsap.fromTo(sl.querySelectorAll('.cs-row'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35, stagger: .06, delay: .1 });
    }
  }
  btns.forEach(function (b, k) { b.addEventListener('click', function () { go(k) }) });
  if (prev) prev.addEventListener('click', function () { go(i - 1) });
  if (next) next.addEventListener('click', function () { go(i + 1) });
  box.setAttribute('tabindex', '0');
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(i - 1) } else if (e.key === 'ArrowRight') { go(i + 1) }
  });
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', vexelCases); } else { vexelCases(); }

/* DAVE: CallRail DNI snippet below this line. */



/* ══════════════════════════════════════════════════════════════════
   VEXELTECH — motion layer (GSAP 3 + ScrollTrigger)
   Built per the official GSAP skills: matchMedia for reduced motion,
   transforms and autoAlpha only, ScrollTrigger.batch for reveals.
   ══════════════════════════════════════════════════════════════════ */
function vexelMotion() {
  var root = document.documentElement;
  function release() { root.classList.remove('g-wait'); }

  if (!window.gsap) { release(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Split the headline into masked words. Element children (the
     highlight block, the square) are wrapped whole so they survive. */
  function splitWords(h) {
    if (!h || h.dataset.split) return;
    var out = document.createDocumentFragment();
    function wrap(node) {
      var w = document.createElement('span'); w.className = 'w';
      var i = document.createElement('span'); i.className = 'wi';
      i.appendChild(node); w.appendChild(i); return w;
    }
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { out.appendChild(document.createTextNode(' ')); }
          else { out.appendChild(wrap(document.createTextNode(t))); }
        });
      } else { out.appendChild(wrap(n.cloneNode(true))); }
    });
    h.innerHTML = ''; h.appendChild(out); h.dataset.split = '1';
  }

  var mm = gsap.matchMedia();

  mm.add({
    motion: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, function (ctx) {
    var reduce = ctx.conditions.reduce;

    /* ── Reduced motion: show everything, animate nothing ── */
    if (reduce) {
      gsap.set('.hero-c > *, .hero-anchor, .hero-fan, .rv, .proc .step, .pledge',
        { autoAlpha: 1, y: 0, clearProps: 'transform' });
      gsap.set('.proc-track i', { scaleX: 1 });
      gsap.set('.hero-anchor .ha .ha-bar', { scaleX: 1, autoAlpha: 0.35 });
      release();
      return;
    }

    var h1 = document.querySelector('.hero-h');
    splitWords(h1);
    release();

    /* ── Hero: one timeline, transforms only ───────────────── */
    var hl = document.querySelector('.hero-h .hl');
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-fan', { autoAlpha: 0, scale: 0.9, duration: 1.5, ease: 'power2.out' }, 0)
      .from('.pill-badge', { autoAlpha: 0, y: 18, duration: 0.6 }, 0.15)
      .from('.hero-h .wi', { yPercent: 112, duration: 0.9, stagger: 0.055 }, 0.3);

    if (hl) {
      tl.fromTo(hl, { '--hlw': 0 }, { duration: 0.01 }, 0); /* no-op keeps order tidy */
      tl.from(hl, { clipPath: 'inset(0 100% 0 0)', duration: 0.55, ease: 'power2.inOut' }, 0.78);
    }

    tl.from('.hero-sub', { autoAlpha: 0, y: 16, duration: 0.75 }, 0.72)
      .from('.hero-c .btn', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.09 }, 0.86)
      .from('.hero-note', { autoAlpha: 0, duration: 0.5 }, 1.02)
      .from('.hero-anchor .ha', { autoAlpha: 0, y: 22, duration: 0.65, stagger: 0.08 }, 1.0);

    /* ── Fan parallax while the hero scrolls away ───────────── */
    gsap.to('.hero-fan', {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    /* ── Section reveals, batched ───────────────────────────── */
    gsap.set('.rv', { autoAlpha: 0, y: 28 });
    ScrollTrigger.batch('.rv', {
      start: 'top 86%',
      onEnter: function (b) {
        gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out', overwrite: true });
      }
    });

    /* ── Process: beacon line scrubs to scroll, steps follow ── */
    var proc = document.getElementById('proc');
    if (proc) {
      gsap.fromTo('.proc-track i', { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: proc, start: 'top 80%', end: 'bottom 65%', scrub: 0.5 }
      });
      gsap.from('.proc .step', {
        autoAlpha: 0, y: 26, duration: 0.7, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: proc, start: 'top 74%' }
      });
      gsap.from('.pledge', {
        autoAlpha: 0, x: -18, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: proc, start: 'top 55%' }
      });
    }

    /* ── Pillar band: live index on a repeating timeline ────── */
    var has = gsap.utils.toArray('.hero-anchor .ha');
    if (has.length) {
      var cyc = gsap.timeline({ repeat: -1, delay: 1.6 });
      has.forEach(function (el, i) {
        var bar = el.querySelector('.ha-bar');
        cyc.call(function () {
          has.forEach(function (a) { a.classList.remove('is-on'); });
          el.classList.add('is-on');
        })
          .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: 'none' })
          .set(bar, { scaleX: 0 });
      });
      has.forEach(function (el, i) {
        el.addEventListener('mouseenter', function () {
          cyc.pause();
          has.forEach(function (a) { a.classList.remove('is-on'); });
          el.classList.add('is-on');
        });
        el.addEventListener('mouseleave', function () { cyc.resume(); });
      });
    }

    /* ── Tab panels: animate on change ──────────────────────── */
    document.querySelectorAll('.tabbar label').forEach(function (lab) {
      lab.addEventListener('click', function () {
        requestAnimationFrame(function () {
          var open = document.querySelector('.tpanel:not([style*="display: none"])');
          var panel = document.querySelector('#' + lab.getAttribute('for') + ':checked ~ .tpanels .tpanel');
          var vis = Array.prototype.filter.call(document.querySelectorAll('.tpanel'), function (p) {
            return getComputedStyle(p).display !== 'none';
          })[0];
          if (!vis) return;
          gsap.fromTo(vis, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
          gsap.fromTo(vis.querySelectorAll('.row, .tags .tag, .art'),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.08 });
        });
      });
    });

    return function () { /* matchMedia reverts everything it created */ };
  });

  /* Safety: never leave content hidden if something goes wrong */
  setTimeout(release, 2500);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', vexelMotion);
} else { vexelMotion(); }




/* ══════════════════════════════════════════════════════════════════
   VEXELTECH — hero 3D mark (Three.js r128)
   The brand mark extruded and flat-shaded. No bloom, no gradients,
   no glass: Cut Stock rules hold in three dimensions.
   Guarded for mobile, reduced motion, and no-WebGL.
   ══════════════════════════════════════════════════════════════════ */
function vexelHero3D() {
  var host = document.getElementById('hero3d');
  if (!host || !window.THREE) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var tiny = window.innerWidth < 480;
  if (tiny) return;                       // phones keep the flat SVG fan

  /* WebGL support probe — fail to the SVG rather than a blank box */
  try {
    var probe = document.createElement('canvas');
    if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return;
  } catch (e) { return; }

  var INK = 0x17181A, BEACON = 0xFFC400;

  var scene = new THREE.Scene();
  var w = host.clientWidth, h = host.clientHeight;
  var camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(w, h);
  host.appendChild(renderer.domElement);

  /* ── The mark, built from the locked path coordinates ───────── */
  var PTS = [[7, 33], [29, 25], [50, 60], [78, 6], [94, 2], [54, 93]];
  var shape = new THREE.Shape();
  PTS.forEach(function (p, i) {
    var x = (p[0] - 50) / 26, y = (50 - p[1]) / 26;   // SVG y-down → three y-up
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  });
  shape.closePath();

  var geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42, bevelEnabled: true, bevelThickness: 0.035,
    bevelSize: 0.035, bevelSegments: isMobile ? 1 : 2, curveSegments: 2
  });
  geo.center();

  /* Flat shading: faceted planes, never a gradient */
  var mat = new THREE.MeshPhongMaterial({ color: BEACON, flatShading: true });
  var mark = new THREE.Mesh(geo, mat);
  var rig = new THREE.Group();          // rig carries placement, mark carries motion
  rig.add(mark);
  rig.position.set(3.25, -0.55, 0);
  rig.scale.setScalar(0.58);
  scene.add(rig);

  /* Ink edge wireframe — the drawn line over the solid, plate-style */
  var edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo, 24),
    new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.34 })
  );
  mark.add(edges);

  /* ── Lighting: keyed so faces read as distinct flat tones ──── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.52));
  var key = new THREE.DirectionalLight(0xffffff, 0.86); key.position.set(4, 6, 7);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.26); fill.position.set(-6, 2, 4);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0xffffff, 0.34); rim.position.set(-2, -4, -6);
  scene.add(rim);


  mark.rotation.set(-0.16, -0.5, 0.02);

  /* ── Interaction: pointer parallax + scroll rotation ────────── */
  var px = 0, py = 0, tx = 0, ty = 0, scrollRot = 0, running = true;

  if (!reduce && !isMobile) {
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      ty = (e.clientY / window.innerHeight - 0.5) * 0.34;
    }, { passive: true });
  }

  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.to({}, {
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6,
        onUpdate: function (self) { scrollRot = self.progress * 1.5; }
      }
    });
    /* entrance */
    gsap.from(mark.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1.5, ease: 'power3.out', delay: 0.25 });
    gsap.from(mark.rotation, { y: -2.6, duration: 1.9, ease: 'power3.out', delay: 0.25 });
    gsap.from(mat, {
      opacity: 0, duration: 1.1, delay: 0.25, onStart: function () { mat.transparent = true; },
      onComplete: function () { mat.transparent = false; }
    });
  }

  /* Pause the loop whenever the hero is off screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting; })
      .observe(document.querySelector('.hero'));
  }

  var t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    t += 0.006;
    px += (tx - px) * 0.055;
    py += (ty - py) * 0.055;

    if (!reduce) {
      mark.rotation.y = -0.5 + Math.sin(t * 0.62) * 0.22 + px * 1.5 + scrollRot;
      mark.rotation.x = -0.16 + Math.cos(t * 0.5) * 0.09 + py;
      mark.position.y = Math.sin(t * 0.8) * 0.07;
    }
    renderer.render(scene, camera);
  }
  frame();

  /* ── Resize ─────────────────────────────────────────────────── */
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var W = host.clientWidth, H = host.clientHeight;
      if (!W || !H) return;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H); place();
    }, 180);
  });

  function place() {
    var W = host.clientWidth;
    var narrow = W < 1120;
    rig.position.x = narrow ? 2.6 : 3.25;
    rig.scale.setScalar(narrow ? 0.46 : 0.58);
  }
  place();
  host.classList.add('is-live');
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', vexelHero3D); } else { vexelHero3D(); }

