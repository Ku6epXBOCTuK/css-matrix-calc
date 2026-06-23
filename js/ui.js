import { resetState } from './state.js';
import { computeHomography, toMatrix3dCSS } from './homography.js';
import { buildCornerInputs, syncCornerInputs, readCornerInputs, syncFieldInputs, syncWidgetInputs } from './inputs.js';
import { updateLivePreview } from './preview.js';

function $(id) { return document.getElementById(id); }

let fieldEditing = false;
let fieldEditW, fieldEditH;
let keepAspect = true;

function updateChainIcon() {
  const locked = $('chainLink').querySelectorAll('.chain-locked');
  const unlocked = $('chainLink').querySelectorAll('.chain-unlocked');
  locked.forEach(el => el.style.display = keepAspect ? '' : 'none');
  unlocked.forEach(el => el.style.display = keepAspect ? 'none' : '');
  $('chainLink').classList.toggle('unlocked', !keepAspect);
}

function setFieldEditing(editing, state) {
  fieldEditing = editing;
  const inpW = $('inpFieldW');
  const inpH = $('inpFieldH');
  const options = $('fieldEditOptions');
  const btnEdit = $('btnEditField');
  const chain = $('chainLink');

  if (editing) {
    fieldEditW = state.fieldW;
    fieldEditH = state.fieldH;
    inpW.disabled = false;
    inpH.disabled = false;
    options.classList.add('visible');
    btnEdit.style.display = 'none';
    chain.classList.add('visible');
    updateChainIcon();
  } else {
    inpW.value = state.fieldW;
    inpW.disabled = true;
    inpH.value = state.fieldH;
    inpH.disabled = true;
    options.classList.remove('visible');
    btnEdit.style.display = '';
    chain.classList.remove('visible');
  }
}

function setMode(mode) {
  document.body.className = mode === 'preview' ? 'mode-preview' : 'mode-edit';
  $('btnEdit').classList.toggle('active', mode === 'edit');
  $('btnPreview').classList.toggle('active', mode === 'preview');
  $('modeHint').textContent = mode === 'edit'
    ? 'Перетаскивайте углы на поле'
    : 'Результат matrix3d() трансформации';
}

export function updateCSSOutput(state) {
  const H = computeHomography(state);
  $('cssOutput').value = toMatrix3dCSS(H);
}

export function initUI(state, updateAll) {
  $('chainLink').addEventListener('click', () => {
    keepAspect = !keepAspect;
    updateChainIcon();
  });

  $('btnEditField').addEventListener('click', () => {
    setFieldEditing(true, state);
    $('inpFieldW').focus();
  });

  $('btnCancelField').addEventListener('click', () => {
    setFieldEditing(false, state);
  });

  $('inpFieldW').addEventListener('input', () => {
    if (!fieldEditing) return;
    const newW = parseInt($('inpFieldW').value);
    if (newW <= 0) return;
    if (keepAspect) {
      fieldEditH = Math.round(newW * state.fieldH / state.fieldW);
      $('inpFieldH').value = fieldEditH;
    }
    fieldEditW = newW;
  });

  $('inpFieldH').addEventListener('input', () => {
    if (!fieldEditing) return;
    const newH = parseInt($('inpFieldH').value);
    if (newH <= 0) return;
    if (keepAspect) {
      fieldEditW = Math.round(newH * state.fieldW / state.fieldH);
      $('inpFieldW').value = fieldEditW;
    }
    fieldEditH = newH;
  });

  $('btnSaveField').addEventListener('click', () => {
    const newW = parseInt($('inpFieldW').value);
    const newH = parseInt($('inpFieldH').value);
    if (newW <= 0 || newH <= 0) return;

    if ($('chkRescaleCoords').checked && (newW !== state.fieldW || newH !== state.fieldH)) {
      const sx = newW / state.fieldW;
      const sy = newH / state.fieldH;
      state.corners.forEach(c => {
        c.x = Math.round(c.x * sx);
        c.y = Math.round(c.y * sy);
      });
    }

    state.fieldW = newW;
    state.fieldH = newH;
    setFieldEditing(false, state);
    buildCornerInputs(state);
    updateAll();
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
      readCornerInputs(state);
      updateAll();
    }
  });

  $('copyBtn').addEventListener('click', () => {
    const text = $('cssOutput').value;
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('copyBtn');
      const orig = btn.textContent;
      btn.textContent = 'Скопировано!';
      setTimeout(() => btn.textContent = orig, 1500);
    });
  });

  $('resetBtn').addEventListener('click', () => {
    setFieldEditing(false, state);
    resetState();
    syncFieldInputs(state, state.fieldW, state.fieldH);
    syncWidgetInputs(state);
    buildCornerInputs(state);
    updateAll();
  });

  $('btnEdit').addEventListener('click', () => {
    setMode('edit');
    requestAnimationFrame(() => updateLivePreview(state));
  });

  $('btnPreview').addEventListener('click', () => {
    setMode('preview');
    requestAnimationFrame(() => updateLivePreview(state));
  });

  window.addEventListener('resize', () => updateLivePreview(state));
}
