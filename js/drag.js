let dragIndex = -1;

function svgPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function initDrag(svg, state, onDragEnd) {
  function updateDragPosition(e) {
    if (dragIndex < 0) return;
    e.preventDefault();
    const pt = svgPoint(svg, e.clientX, e.clientY);
    state.corners[dragIndex].x = Math.round(Math.max(0, Math.min(state.fieldW, pt.x)));
    state.corners[dragIndex].y = Math.round(Math.max(0, Math.min(state.fieldH, pt.y)));

    const circles = svg.querySelectorAll('.corner-circle');
    const c = state.corners[dragIndex];
    circles[dragIndex].setAttribute('cx', c.x);
    circles[dragIndex].setAttribute('cy', c.y);

    const poly = svg.querySelector('polygon');
    const pts = state.corners.map(p => `${p.x},${p.y}`).join(' ');
    poly.setAttribute('points', pts);
  }

  function endDrag() {
    dragIndex = -1;
    svg.classList.remove('dragging');
    document.removeEventListener('pointermove', updateDragPosition);
    document.removeEventListener('pointerup', endDrag);
    onDragEnd();
  }

  svg.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('.corner-circle');
    if (!target) return;
    e.preventDefault();
    dragIndex = parseInt(target.dataset.index);
    svg.classList.add('dragging');
    document.addEventListener('pointermove', updateDragPosition);
    document.addEventListener('pointerup', endDrag);
  });
}
