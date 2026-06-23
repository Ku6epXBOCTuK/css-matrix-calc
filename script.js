(() => {
  const LABELS = ['TL', 'TR', 'BR', 'BL'];

  const defaultState = {
    fieldW: 1920, fieldH: 1080,
    widgetW: 400, widgetH: 300,
    corners: [
      { x: 300, y: 200 },
      { x: 1620, y: 150 },
      { x: 1580, y: 920 },
      { x: 340, y: 950 }
    ]
  };

  const state = {
    fieldW: 1920, fieldH: 1080,
    widgetW: 400, widgetH: 300,
    corners: [
      { x: 300, y: 200 },
      { x: 1620, y: 150 },
      { x: 1580, y: 920 },
      { x: 340, y: 950 }
    ]
  };

  const $ = id => document.getElementById(id);
  const svg = $('svg');

  // ===== Homography math =====
  function computeHomography() {
    const w = state.widgetW, h = state.widgetH;
    if (w <= 0 || h <= 0) return null;
    const [p0, p1, p2, p3] = state.corners;

    const a11 = p2.x - p1.x, a12 = p2.x - p3.x;
    const b1 = p1.x + p3.x - p0.x - p2.x;
    const a21 = p2.y - p1.y, a22 = p2.y - p3.y;
    const b2 = p1.y + p3.y - p0.y - p2.y;

    const D = a11 * a22 - a12 * a21;
    if (Math.abs(D) < 1e-10) return null;

    const A = (b1 * a22 - b2 * a12) / D;
    const B = (a11 * b2 - a21 * b1) / D;

    return {
      h00: (p1.x * (A + 1) - p0.x) / w,
      h10: (p1.y * (A + 1) - p0.y) / w,
      h01: (p3.x * (B + 1) - p0.x) / h,
      h11: (p3.y * (B + 1) - p0.y) / h,
      h02: p0.x,
      h12: p0.y,
      h20: A / w,
      h21: B / h,
      h22: 1
    };
  }

  function toMatrix3dCSS(H) {
    if (!H) return '/* вырожденная конфигурация */';
    const n = v => parseFloat(v.toFixed(8));
    return [
      'transform-origin: 0 0;',
      'transform: matrix3d(',
      `  ${n(H.h00)}, ${n(H.h10)}, 0, ${n(H.h20)},`,
      `  ${n(H.h01)}, ${n(H.h11)}, 0, ${n(H.h21)},`,
      `  0, 0, 1, 0,`,
      `  ${n(H.h02)}, ${n(H.h12)}, 0, ${n(H.h22)}`,
      ');'
    ].join('\n');
  }

  // ===== SVG rendering =====
  function gridInterval(maxDim) {
    if (maxDim <= 500) return 50;
    if (maxDim <= 1000) return 100;
    if (maxDim <= 2000) return 200;
    return 500;
  }

  function renderSVG() {
    svg.setAttribute('viewBox', `0 0 ${state.fieldW} ${state.fieldH}`);
    svg.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('width', state.fieldW);
    rect.setAttribute('height', state.fieldH);
    rect.setAttribute('fill', '#0a0e14');
    svg.appendChild(rect);

    const step = gridInterval(Math.max(state.fieldW, state.fieldH));
    const gridG = document.createElementNS(ns, 'g');
    for (let x = step; x < state.fieldW; x += step) {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', 0);
      line.setAttribute('x2', x); line.setAttribute('y2', state.fieldH);
      line.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      line.setAttribute('stroke-width', 1);
      gridG.appendChild(line);
    }
    for (let y = step; y < state.fieldH; y += step) {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', 0); line.setAttribute('y1', y);
      line.setAttribute('x2', state.fieldW); line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      line.setAttribute('stroke-width', 1);
      gridG.appendChild(line);
    }
    svg.appendChild(gridG);

    const widgetRect = document.createElementNS(ns, 'rect');
    widgetRect.setAttribute('x', 0);
    widgetRect.setAttribute('y', 0);
    widgetRect.setAttribute('width', state.widgetW);
    widgetRect.setAttribute('height', state.widgetH);
    widgetRect.setAttribute('fill', 'none');
    widgetRect.setAttribute('stroke', 'rgba(88,166,255,0.2)');
    widgetRect.setAttribute('stroke-width', 2);
    widgetRect.setAttribute('stroke-dasharray', '12,8');
    svg.appendChild(widgetRect);

    const poly = document.createElementNS(ns, 'polygon');
    const pts = state.corners.map(c => `${c.x},${c.y}`).join(' ');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'rgba(88,166,255,0.1)');
    poly.setAttribute('stroke', '#58a6ff');
    poly.setAttribute('stroke-width', 3);
    poly.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(poly);

    state.corners.forEach((c, i) => {
      const g = document.createElementNS(ns, 'g');

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', c.x);
      circle.setAttribute('cy', c.y);
      circle.setAttribute('r', 10);
      circle.setAttribute('fill', '#58a6ff');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', 2.5);
      circle.setAttribute('class', 'corner-circle');
      circle.dataset.index = i;
      g.appendChild(circle);

      const label = document.createElementNS(ns, 'text');
      const lx = c.x + (i === 0 || i === 3 ? -30 : 20);
      const ly = c.y + (i < 2 ? -18 : 28);
      label.setAttribute('x', lx);
      label.setAttribute('y', ly);
      label.setAttribute('class', 'corner-label');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = LABELS[i];
      g.appendChild(label);

      const coord = document.createElementNS(ns, 'text');
      coord.setAttribute('x', lx);
      coord.setAttribute('y', ly + 18);
      coord.setAttribute('class', 'corner-coord');
      coord.setAttribute('text-anchor', 'middle');
      coord.textContent = `(${c.x}, ${c.y})`;
      g.appendChild(coord);

      svg.appendChild(g);
    });
  }

  // ===== Drag handling =====
  let dragIndex = -1;

  function svgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function onPointerDown(e) {
    const target = e.target.closest('.corner-circle');
    if (!target) return;
    e.preventDefault();
    dragIndex = parseInt(target.dataset.index);
    target.classList.add('dragging');
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (dragIndex < 0) return;
    e.preventDefault();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const pt = svgPoint(cx, cy);
    state.corners[dragIndex].x = Math.round(Math.max(0, Math.min(state.fieldW, pt.x)));
    state.corners[dragIndex].y = Math.round(Math.max(0, Math.min(state.fieldH, pt.y)));
    updateAll();
  }

  function onPointerUp() {
    dragIndex = -1;
    document.querySelectorAll('.corner-circle.dragging').forEach(el => el.classList.remove('dragging'));
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
  }

  svg.addEventListener('mousedown', onPointerDown);
  svg.addEventListener('touchstart', onPointerDown, { passive: false });

  // ===== Live preview =====
  function updateLivePreview() {
    const container = $('fieldContainer');
    const cw = container.clientWidth;
    if (cw <= 0) return;

    const scale = cw / state.fieldW;
    const field = $('field');
    field.style.width = state.fieldW + 'px';
    field.style.height = state.fieldH + 'px';
    field.style.transform = `scale(${scale})`;
    container.style.height = (state.fieldH * scale) + 'px';

    const widget = $('widget');
    widget.style.width = state.widgetW + 'px';
    widget.style.height = state.widgetH + 'px';

    const H = computeHomography();
    if (H) {
      const n = v => parseFloat(v.toFixed(6));
      widget.style.transform = `matrix3d(${n(H.h00)},${n(H.h10)},0,${n(H.h20)},${n(H.h01)},${n(H.h11)},0,${n(H.h21)},0,0,1,0,${n(H.h02)},${n(H.h12)},0,${n(H.h22)})`;
      widget.style.opacity = '1';
    } else {
      widget.style.transform = 'none';
      widget.style.opacity = '0.3';
    }
  }

  // ===== Corner inputs =====
  function buildCornerInputs() {
    const container = $('cornerInputs');
    container.innerHTML = '';
    LABELS.forEach((label, i) => {
      const row = document.createElement('div');
      row.className = 'corner-input-row';
      row.innerHTML = `
        <span class="label">${label}</span>
        <label><span>x</span><input id="c${i}x" type="number" value="${state.corners[i].x}"></label>
        <label><span>y</span><input id="c${i}y" type="number" value="${state.corners[i].y}"></label>
      `;
      container.appendChild(row);
    });
  }

  function syncCornerInputs() {
    state.corners.forEach((c, i) => {
      const xi = $(`c${i}x`);
      const yi = $(`c${i}y`);
      if (document.activeElement !== xi) xi.value = c.x;
      if (document.activeElement !== yi) yi.value = c.y;
    });
  }

  function readCornerInputs() {
    state.corners.forEach((c, i) => {
      const x = parseInt($(`c${i}x`).value);
      const y = parseInt($(`c${i}y`).value);
      if (!isNaN(x)) c.x = x;
      if (!isNaN(y)) c.y = y;
    });
  }

  // ===== Update all =====
  function updateAll() {
    renderSVG();
    updateLivePreview();
    syncCornerInputs();
    updateCSSOutput();
  }

  function updateCSSOutput() {
    const H = computeHomography();
    $('cssOutput').value = toMatrix3dCSS(H);
  }

  // ===== Input events =====
  $('inpFieldW').addEventListener('input', () => {
    const v = parseInt($('inpFieldW').value);
    if (v > 0) { state.fieldW = v; updateAll(); }
  });
  $('inpFieldH').addEventListener('input', () => {
    const v = parseInt($('inpFieldH').value);
    if (v > 0) { state.fieldH = v; updateAll(); }
  });
  $('inpWidgetW').addEventListener('input', () => {
    const v = parseInt($('inpWidgetW').value);
    if (v > 0) { state.widgetW = v; updateAll(); }
  });
  $('inpWidgetH').addEventListener('input', () => {
    const v = parseInt($('inpWidgetH').value);
    if (v > 0) { state.widgetH = v; updateAll(); }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id && /^c\d[xy]$/.test(e.target.id)) {
      readCornerInputs();
      updateAll();
    }
  });

  // ===== Copy =====
  $('copyBtn').addEventListener('click', () => {
    const text = $('cssOutput').value;
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('copyBtn');
      const orig = btn.textContent;
      btn.textContent = 'Скопировано!';
      setTimeout(() => btn.textContent = orig, 1500);
    });
  });

  // ===== Reset =====
  $('resetBtn').addEventListener('click', () => {
    state.fieldW = defaultState.fieldW;
    state.fieldH = defaultState.fieldH;
    state.widgetW = defaultState.widgetW;
    state.widgetH = defaultState.widgetH;
    defaultState.corners.forEach((c, i) => {
      state.corners[i] = { x: c.x, y: c.y };
    });
    $('inpFieldW').value = state.fieldW;
    $('inpFieldH').value = state.fieldH;
    $('inpWidgetW').value = state.widgetW;
    $('inpWidgetH').value = state.widgetH;
    buildCornerInputs();
    updateAll();
  });

  // ===== Resize =====
  window.addEventListener('resize', updateLivePreview);

  // ===== Init =====
  buildCornerInputs();
  updateAll();
})();