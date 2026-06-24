import { computeHomography } from './homography.js';

function $(id) { return document.getElementById(id); }

function applyBgToField(field, state) {
  if (state.bgImage) {
    field.style.backgroundImage = `url(${state.bgImage})`;
    field.style.backgroundSize = state.objectFit === 'fill' ? '100% 100%' : state.objectFit;
  } else {
    field.style.backgroundImage = 'none';
    field.style.backgroundSize = '';
  }
}

function applyWidgetImage(widget, state) {
  if (state.widgetImage) {
    widget.style.backgroundImage = `url(${state.widgetImage})`;
    widget.style.backgroundSize = '100% 100%';
    widget.style.backgroundPosition = 'center';
    widget.style.backgroundRepeat = 'no-repeat';
    widget.querySelector('span').style.display = 'none';
  } else {
    widget.style.backgroundImage = '';
    widget.style.backgroundSize = '';
    widget.style.backgroundPosition = '';
    widget.style.backgroundRepeat = '';
    widget.querySelector('span').style.display = '';
  }
}

export function updateLivePreview(state) {
  const container = $('fieldContainer');
  const cw = container.clientWidth;
  if (cw <= 0) return;

  const maxH = window.innerHeight - 140;
  const scaleW = cw / state.fieldW;
  const scaleH = maxH / state.fieldH;
  const scale = Math.min(scaleW, scaleH);

  const field = $('field');
  field.style.width = state.fieldW + 'px';
  field.style.height = state.fieldH + 'px';
  field.style.transform = `scale(${scale})`;
  container.style.height = (state.fieldH * scale) + 'px';

  applyBgToField(field, state);

  const widget = $('widget');
  widget.style.width = state.widgetW + 'px';
  widget.style.height = state.widgetH + 'px';

  applyWidgetImage(widget, state);

  const H = computeHomography(state);
  if (H) {
    const n = v => parseFloat(v.toFixed(6));
    widget.style.transform = `matrix3d(${n(H.h00)},${n(H.h10)},0,${n(H.h20)},${n(H.h01)},${n(H.h11)},0,${n(H.h21)},0,0,1,0,${n(H.h02)},${n(H.h12)},0,${n(H.h22)})`;
    widget.style.opacity = '1';
  } else {
    widget.style.transform = 'none';
    widget.style.opacity = '0.3';
  }
}
