/* svcshots.mjs — the Services page at both widths, with plate 02 frozen
   mid-straighten on the 1280 shot.

   THE STRAIGHTEN IS A CSS TRANSITION, NOT A KEYFRAME ANIMATION, and
   `getAnimations()` returns it as a CSSTransition all the same. So it can be
   paused and seeked exactly like the hero entrance is — which is the only way
   to catch a 250ms state change in a full-page capture that takes longer than
   250ms to render. Every OTHER animation on the page is pushed past its end
   first, so nothing else is caught mid-flight and mistaken for a defect. */
import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:'new',
  args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb','--font-render-hinting=none']});

for (const [w,h,mid] of [[1280,900,true],[390,844,false]]) {
 const p=await b.newPage(); await p.setViewport({width:w,height:h});
 await p.goto('http://localhost:4179/services',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,2500));
 const tot=await p.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<tot;y+=h/2){await p.evaluate(v=>window.scrollTo(0,v),y);await new Promise(r=>setTimeout(r,150));}
 await p.evaluate(()=>window.scrollTo(0,0));
 await new Promise(r=>setTimeout(r,600));

 if (mid) {
   /* Plate 02 back to its tilt, then straightened and FROZEN AT HALF ITS
      ROTATION.

      Half the ROTATION, not half the clock. `--ease-reveal` is
      cubic-bezier(.23, 1, .32, 1), which spends most of its distance in the
      first fifth of its time: at 125ms of 250ms the plate is already down to
      0.19 of its 1.5 degrees and photographs as straight. The frame a reader
      would call mid-straighten is the one with half the tilt left, and the
      seek below finds it by measuring rather than by assuming. It is a real
      frame of the real transition, paused and seeked — not a staged
      transform.

      EACH STATE CHANGE IS ITS OWN CALL, WITH A REAL WAIT BETWEEN THEM. The
      first version did the whole sequence inside one `evaluate` and waited on
      two `requestAnimationFrame`s between setting the attribute and reading
      the result. Nothing had moved when it read: the tilt had not been
      committed, no transition existed, and `getAnimations()` came back empty
      while the plate sat at its straightened value. Same family as the
      entrance-capture defect in BUILD-LAW — a frame read before the browser
      got to it looks exactly like a frame that never happened. */
   await p.evaluate(()=>{document.querySelectorAll('.svc__plate')[1].dataset.in='false';});
   await new Promise(r=>setTimeout(r,450));   /* the tilt, settled */
   await p.evaluate(()=>{document.querySelectorAll('.svc__plate')[1].dataset.in='true';});
   await new Promise(r=>setTimeout(r,20));    /* the transition, running */

   const state=await p.evaluate(()=>{
     const el=document.querySelectorAll('.svc__plate')[1];
     const rot=()=>{const m=new DOMMatrix(getComputedStyle(el).transform);
       return Math.atan2(m.b,m.a)*180/Math.PI;};
     /* ONLY THE PLATE'S OWN TRANSITION IS TOUCHED.

        The first version pushed every other animation on the page to
        `currentTime = 10000` to stop anything else being caught mid-flight.
        That put the page into a state no reader will ever see: the SKIP LINK
        has a transition, and forcing it to its end painted a white bar across
        the top of the capture, with a second forced transition showing as a
        grey band under the heading. BUILD-LAW already records this exact
        failure from the transition capture — a harness that forces states is a
        harness that invents them. Nothing else needs freezing here anyway: the
        capture runs after a full scroll walk and a settle, so everything else
        is at rest on its own. */
     let mine=null;
     for (const a of document.getAnimations()) {
       if (a.effect && a.effect.target === el) { mine=a; a.pause(); }
     }
     if (!mine) return {frozen:false};
     mine.currentTime=0;
     const start=rot();
     /* bisect the timeline for the frame where half the tilt remains */
     let lo=0, hi=250, t=0;
     for (let i=0;i<20;i++){ t=(lo+hi)/2; mine.currentTime=t;
       if (Math.abs(rot()) > Math.abs(start)/2) lo=t; else hi=t; }
     mine.currentTime=t;
     return {frozen:true, ms:+t.toFixed(1), startDeg:+start.toFixed(2),
             heldDeg:+rot().toFixed(2), transform:getComputedStyle(el).transform};
   });
   console.log('  plate 02:', JSON.stringify(state));
 }

 await p.screenshot({path:`.measure/out/agency/svc-${w}.png`, fullPage:true});
 console.log(`  ${w}: page ${tot}px`);
 await p.close();
}
await b.close();
