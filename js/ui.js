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
    ? 'Drag corners on the field'
    : 'matrix3d() transform result';
}

let updateAllRef;

function loadBgFile(file, state) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.bgImage = reader.result;
    $('btnBgRemove').style.display = '';
    updateAllRef();
  };
  reader.readAsDataURL(file);
}

function clearBg(state) {
  state.bgImage = null;
  $('btnBgRemove').style.display = 'none';
  updateAllRef();
}

export function updateCSSOutput(state) {
  const H = computeHomography(state);
  $('cssOutput').value = toMatrix3dCSS(H);
}

export function initUI(state, updateAll) {
  updateAllRef = updateAll;

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

  document.addEventListener('paste', (e) => {
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

  const lc = document.querySelector('.left-col');

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.classList.add('file-dragging');
  });

  document.addEventListener('drop', () => {
    document.body.classList.remove('file-dragging');
    lc.classList.remove('drag-over');
  });

  lc.addEventListener('dragover', (e) => {
    e.preventDefault();
    lc.classList.add('drag-over');
  });

  lc.addEventListener('dragleave', (e) => {
    if (!lc.contains(e.relatedTarget)) {
      lc.classList.remove('drag-over');
    }
  });

  lc.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.classList.remove('file-dragging');
    lc.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) loadBgFile(e.dataTransfer.files[0], state);
  });

  const bp = $('bgPanel');
  bp.addEventListener('dragover', (e) => {
    e.preventDefault();
    bp.classList.add('drag-over');
  });
  bp.addEventListener('dragleave', (e) => {
    if (!bp.contains(e.relatedTarget)) {
      bp.classList.remove('drag-over');
    }
  });
  bp.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.classList.remove('file-dragging');
    bp.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) loadBgFile(e.dataTransfer.files[0], state);
  });
}
