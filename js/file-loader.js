import { $ } from './dom.js';

let updateAllRef;

export function setUpdateAllRef(fn) {
  updateAllRef = fn;
}

export function loadBgFile(file, state) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.bgImage = reader.result;
    $('btnBgRemove').style.display = '';
    updateAllRef();
  };
  reader.readAsDataURL(file);
}

export function clearBg(state) {
  state.bgImage = null;
  $('btnBgRemove').style.display = 'none';
  updateAllRef();
}

export function setWidgetImageLock(locked) {
  $('inpWidgetW').disabled = locked;
  $('inpWidgetH').disabled = locked;
  $('btnWidgetRemove').style.display = locked ? '' : 'none';
}

export function loadWidgetFile(file, state) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.widgetImage = reader.result;
    const img = new Image();
    img.onload = () => {
      state.widgetW = img.naturalWidth;
      state.widgetH = img.naturalHeight;
      $('inpWidgetW').value = state.widgetW;
      $('inpWidgetH').value = state.widgetH;
      setWidgetImageLock(true);
      updateAllRef();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
