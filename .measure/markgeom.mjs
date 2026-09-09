/* markgeom.mjs — the V's own numbers, from the shipped path.

   Everything the page transition draws is derived here rather than typed in,
   so the shapes cannot drift from the mark. The path is the one in
   src/components/site/Wordmark.jsx, on its 0 0 100 100 box. */
const P = { 0:[7,33], 1:[29,25], 2:[50,60], 3:[78,6], 4:[94,2], 5:[54,93] };
const deg = (dx, dy) => (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI;
const edge = (a, b) => { const dx = P[b][0]-P[a][0], dy = P[b][1]-P[a][1];
  return { dx, dy, deg: +deg(dx,dy).toFixed(2) }; };

console.log('EDGES');
console.log(' short arm outer  P5->P0 ', JSON.stringify(edge(5,0)));
console.log(' short arm inner  P1->P2 ', JSON.stringify(edge(1,2)));
console.log(' long  arm inner  P2->P3 ', JSON.stringify(edge(2,3)));
console.log(' long  arm outer  P4->P5 ', JSON.stringify(edge(4,5)));
console.log(' left tip         P0->P1 ', JSON.stringify(edge(0,1)));
console.log(' right tip        P3->P4 ', JSON.stringify(edge(3,4)));
console.log('\nRECORDED in DESIGN.md: "the long arm\'s 44 across and 58 up" =',
  (Math.atan2(58,44)*180/Math.PI).toFixed(2), 'deg');

const bbox = { x0: 7, x1: 94, y0: 2, y1: 93 };
console.log('\nBBOX', JSON.stringify(bbox), 'w', bbox.x1-bbox.x0, 'h', bbox.y1-bbox.y0);

/* A. The V smeared right by S. The smear closes the notch and makes both the
   leading and the trailing edge the mark's own outer arm edges. */
const S = 340;
/* where the long arm's INNER edge P2->P3 sits at the left tip's y (25) */
const t = (25 - P[2][1]) / (P[3][1] - P[2][1]);
const notchX = +(P[2][0] + t * (P[3][0] - P[2][0])).toFixed(2);
const A = [
  [P[1][0], P[1][1]], [notchX, 25], [P[3][0], P[3][1]], [P[4][0], P[4][1]],
  [P[4][0] + S, P[4][1]], [P[5][0] + S, P[5][1]], [P[5][0], P[5][1]], [P[0][0], P[0][1]],
];
console.log('\nA sweep, S =', S, '  notch closes at x', notchX);
console.log(' path d =', 'M' + A.map((p) => p.join(' ')).join(' L') + ' Z');
console.log(' viewBox =', `${bbox.x0} ${bbox.y0} ${bbox.x1 - bbox.x0 + S} ${bbox.y1 - bbox.y0}`);

/* B. The outer chevron P0->P5->P4, extended far past the frame on both sides.
   These two lines are the cut; everything below is one half, above the other. */
const ext = (a, b, x) => { const t2 = (x - P[a][0]) / (P[b][0] - P[a][0]);
  return [x, +(P[a][1] + t2 * (P[b][1] - P[a][1])).toFixed(2)]; };
const L = ext(5, 0, -300), R = ext(5, 4, 400);
console.log('\nB split, cut =', JSON.stringify([L, P[0], P[5], P[4], R]));
console.log(' lower half d = M' + [L, P[0], P[5], P[4], R, [400, 600], [-300, 600]].map((p)=>p.join(' ')).join(' L') + ' Z');
console.log(' upper half d = M' + [L, P[0], P[5], P[4], R, [400, -900], [-300, -900]].map((p)=>p.join(' ')).join(' L') + ' Z');

/* C. The two arms as separate quadrilaterals, and the vertex the draw grows
   from. Radius needed to reach the furthest point of either arm. */
console.log('\nC strike');
console.log(' short arm d = M' + [P[5], P[0], P[1], P[2]].map((p)=>p.join(' ')).join(' L') + ' Z');
console.log(' long  arm d = M' + [P[2], P[3], P[4], P[5]].map((p)=>p.join(' ')).join(' L') + ' Z');
const vx = P[5];
const far = Math.max(...Object.values(P).map(([x,y]) => Math.hypot(x-vx[0], y-vx[1])));
console.log(' vertex', vx, ' radius to reach every point', far.toFixed(2));
