const LABELS = ['TL', 'TR', 'BR', 'BL'];
const ns = 'http://www.w3.org/2000/svg';

function gridInterval(maxDim) {
  if (maxDim <= 500) return 50;
  if (maxDim <= 1000) return 100;
  if (maxDim <= 2000) return 200;
  return 500;
}

function setAttrs(el, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
}

export function renderSVG(svg, state) {
  svg.setAttribute('viewBox', `0 0 ${state.fieldW} ${state.fieldH}`);
  svg.innerHTML = '';

  const rect = document.createElementNS(ns, 'rect');
  setAttrs(rect, {
    width: state.fieldW,
    height: state.fieldH,
    fill: '#0a0e14'
  });
  svg.appendChild(rect);

  const step = gridInterval(Math.max(state.fieldW, state.fieldH));
  const gridG = document.createElementNS(ns, 'g');
  for (let x = step; x < state.fieldW; x += step) {
    const line = document.createElementNS(ns, 'line');
    setAttrs(line, { x1: x, y1: 0, x2: x, y2: state.fieldH, stroke: 'rgba(255,255,255,0.06)', 'stroke-width': 1 });
    gridG.appendChild(line);
  }
  for (let y = step; y < state.fieldH; y += step) {
    const line = document.createElementNS(ns, 'line');
    setAttrs(line, { x1: 0, y1: y, x2: state.fieldW, y2: y, stroke: 'rgba(255,255,255,0.06)', 'stroke-width': 1 });
    gridG.appendChild(line);
  }
  svg.appendChild(gridG);

  const cx = state.corners.reduce((s, c) => s + c.x, 0) / 4;
  const cy = state.corners.reduce((s, c) => s + c.y, 0) / 4;

  const widgetRect = document.createElementNS(ns, 'rect');
  setAttrs(widgetRect, {
    x: cx - state.widgetW / 2,
    y: cy - state.widgetH / 2,
    width: state.widgetW,
    height: state.widgetH,
    fill: 'rgba(88,166,255,0.12)',
    stroke: 'rgba(88,166,255,0.4)',
    'stroke-width': 2,
    'stroke-dasharray': '12,8'
  });
  svg.appendChild(widgetRect);

  const poly = document.createElementNS(ns, 'polygon');
  const pts = state.corners.map(c => `${c.x},${c.y}`).join(' ');
  setAttrs(poly, {
    points: pts,
    fill: 'rgba(88,166,255,0.1)',
    stroke: '#58a6ff',
    'stroke-width': 3,
    'stroke-linejoin': 'round'
  });
  svg.appendChild(poly);

  state.corners.forEach((c, i) => {
    const g = document.createElementNS(ns, 'g');

    const circle = document.createElementNS(ns, 'circle');
    setAttrs(circle, {
      cx: c.x, cy: c.y, r: 10,
      fill: '#58a6ff',
      stroke: '#ffffff',
      'stroke-width': 2.5,
      class: 'corner-circle'
    });
    circle.dataset.index = i;
    g.appendChild(circle);

    const lx = c.x + (i === 0 || i === 3 ? -30 : 20);
    const ly = c.y + (i < 2 ? -18 : 28);

    const label = document.createElementNS(ns, 'text');
    setAttrs(label, { x: lx, y: ly, class: 'corner-label', 'text-anchor': 'middle' });
    label.textContent = LABELS[i];
    g.appendChild(label);

    const coord = document.createElementNS(ns, 'text');
    setAttrs(coord, { x: lx, y: ly + 18, class: 'corner-coord', 'text-anchor': 'middle' });
    coord.textContent = `(${c.x}, ${c.y})`;
    g.appendChild(coord);

    svg.appendChild(g);
  });
}
