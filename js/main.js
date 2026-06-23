import { state } from './state.js';
import { renderSVG } from './svg-renderer.js';
import { initDrag } from './drag.js';
import { buildCornerInputs, syncCornerInputs } from './inputs.js';
import { updateLivePreview } from './preview.js';
import { updateCSSOutput, initUI } from './ui.js';

function updateAll() {
  renderSVG(document.getElementById('svg'), state);
  updateLivePreview(state);
  syncCornerInputs(state);
  updateCSSOutput(state);
}

function init() {
  document.body.className = 'mode-edit';
  buildCornerInputs(state);
  initDrag(document.getElementById('svg'), state, updateAll);
  initUI(state, updateAll);
  updateAll();
}

init();
