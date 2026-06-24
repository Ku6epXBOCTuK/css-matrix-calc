import { $ } from './dom.js';
import { resetState } from './state.js';
import { computeHomography, toMatrix3dCSS } from './homography.js';
import { buildCornerInputs, syncCornerInputs, readCornerInputs, syncFieldInputs, syncWidgetInputs } from './inputs.js';
import { updateLivePreview } from './preview.js';
import { setFieldEditing, setMode, toggleKeepAspect, isFieldEditing, getFieldEditW, getFieldEditH, setFieldEditW, setFieldEditH, isKeepAspect } from './mode.js';
import { setUpdateAllRef, loadBgFile, clearBg, loadWidgetFile, setWidgetImageLock } from './file-loader.js';
import { initDropZones } from './drop-zone.js';

export function updateCSSOutput(state) {
  const H = computeHomography(state);
  $('cssOutput').value = toMatrix3dCSS(H);
}

export function initUI(state, updateAll) {
  setUpdateAllRef(updateAll);

  $('chainLink').addEventListener('click', () => {
    toggleKeepAspect();
  });

  $('btnEditField').addEventListener('click', () => {
    setFieldEditing(true, state);
    $('inpFieldW').focus();
  });

  $('btnCancelField').addEventListener('click', () => {
    setFieldEditing(false, state);
  });

  $('inpFieldW').addEventListener('input', () => {
    if (!isFieldEditing()) return;
    const newW = parseInt($('inpFieldW').value);
    if (newW <= 0) return;
    if (isKeepAspect()) {
      const newH = Math.round(newW * state.fieldH / state.fieldW);
      $('inpFieldH').value = newH;
      setFieldEditH(newH);
    }
    setFieldEditW(newW);
  });

  $('inpFieldH').addEventListener('input', () => {
    if (!isFieldEditing()) return;
    const newH = parseInt($('inpFieldH').value);
    if (newH <= 0) return;
    if (isKeepAspect()) {
      const newW = Math.round(newH * state.fieldW / state.fieldH);
      $('inpFieldW').value = newW;
      setFieldEditW(newW);
    }
    setFieldEditH(newH);
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
    if (state.widgetImage) return;
    const v = parseInt($('inpWidgetW').value);
    if (v > 0) { state.widgetW = v; updateAll(); }
  });

  $('inpWidgetH').addEventListener('input', () => {
    if (state.widgetImage) return;
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
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1500);
    });
  });

  $('resetBtn').addEventListener('click', () => {
    setFieldEditing(false, state);
    resetState();
    syncFieldInputs(state, state.fieldW, state.fieldH);
    syncWidgetInputs(state);
    buildCornerInputs(state);
    $('btnBgRemove').style.display = 'none';
    $('bgObjectFit').value = state.objectFit;
    $('inpWidgetW').disabled = false;
    $('inpWidgetH').disabled = false;
    $('btnWidgetRemove').style.display = 'none';
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

  $('btnBgLoad').addEventListener('click', () => $('bgFileInput').click());

  $('bgFileInput').addEventListener('change', (e) => {
    if (e.target.files[0]) loadBgFile(e.target.files[0], state);
    e.target.value = '';
  });

  $('btnBgRemove').addEventListener('click', () => clearBg(state));

  $('bgObjectFit').addEventListener('change', (e) => {
    state.objectFit = e.target.value;
    updateAll();
  });

  $('btnWidgetLoad').addEventListener('click', () => $('widgetFileInput').click());

  $('widgetFileInput').addEventListener('change', (e) => {
    if (e.target.files[0]) loadWidgetFile(e.target.files[0], state);
    e.target.value = '';
  });

  $('btnWidgetRemove').addEventListener('click', () => {
    state.widgetImage = null;
    setWidgetImageLock(false);
    updateAll();
  });

  $('widgetPasteInput').addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) loadWidgetFile(file, state);
        break;
      }
    }
  });

  document.addEventListener('paste', (e) => {
    if (document.activeElement?.id === 'widgetPasteInput') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) loadBgFile(file, state);
        break;
      }
    }
  });

  initDropZones(state);
}
