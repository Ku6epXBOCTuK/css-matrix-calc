import { $ } from './dom.js';

let fieldEditing = false;
let fieldEditW, fieldEditH;
let keepAspect = true;

export function isFieldEditing() {
  return fieldEditing;
}

export function getFieldEditW() {
  return fieldEditW;
}

export function getFieldEditH() {
  return fieldEditH;
}

export function setFieldEditW(v) {
  fieldEditW = v;
}

export function setFieldEditH(v) {
  fieldEditH = v;
}

export function isKeepAspect() {
  return keepAspect;
}

export function toggleKeepAspect() {
  keepAspect = !keepAspect;
  updateChainIcon();
}

function updateChainIcon() {
  const locked = $('chainLink').querySelectorAll('.chain-locked');
  const unlocked = $('chainLink').querySelectorAll('.chain-unlocked');
  locked.forEach(el => el.style.display = keepAspect ? '' : 'none');
  unlocked.forEach(el => el.style.display = keepAspect ? 'none' : '');
  $('chainLink').classList.toggle('unlocked', !keepAspect);
}

export function setFieldEditing(editing, state) {
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

export function setMode(mode) {
  document.body.className = mode === 'preview' ? 'mode-preview' : 'mode-edit';
  $('btnEdit').classList.toggle('active', mode === 'edit');
  $('btnPreview').classList.toggle('active', mode === 'preview');
  $('modeHint').textContent = mode === 'edit'
    ? 'Drag corners on the field'
    : 'matrix3d() transform result';
}
