import { $ } from './dom.js';
import { LABELS } from './constants.js';

export function buildCornerInputs(state) {
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

export function syncCornerInputs(state) {
  state.corners.forEach((c, i) => {
    const xi = $(`c${i}x`);
    const yi = $(`c${i}y`);
    if (document.activeElement !== xi) xi.value = c.x;
    if (document.activeElement !== yi) yi.value = c.y;
  });
}

export function readCornerInputs(state) {
  state.corners.forEach((c, i) => {
    const xi = $(`c${i}x`);
    const yi = $(`c${i}y`);
    const x = parseInt(xi.value);
    const y = parseInt(yi.value);

    xi.classList.toggle('input-error', isNaN(x));
    yi.classList.toggle('input-error', isNaN(y));

    if (!isNaN(x)) c.x = x;
    if (!isNaN(y)) c.y = y;
  });
}

export function syncFieldInputs(state, fieldW, fieldH) {
  $('inpFieldW').value = fieldW;
  $('inpFieldH').value = fieldH;
}

export function syncWidgetInputs(state) {
  $('inpWidgetW').value = state.widgetW;
  $('inpWidgetH').value = state.widgetH;
}
