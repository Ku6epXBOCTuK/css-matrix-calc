import { $ } from './dom.js';
import { loadBgFile, loadWidgetFile } from './file-loader.js';

function setupDropZone(el, onDrop) {
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.classList.add('drag-over');
  });

  el.addEventListener('dragleave', (e) => {
    if (!el.contains(e.relatedTarget)) {
      el.classList.remove('drag-over');
    }
  });

  el.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.classList.remove('file-dragging');
    el.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) onDrop(e.dataTransfer.files[0]);
  });
}

export function initDropZones(state) {
  const lc = document.querySelector('.left-col');

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.classList.add('file-dragging');
  });

  document.addEventListener('drop', () => {
    document.body.classList.remove('file-dragging');
    lc.classList.remove('drag-over');
  });

  setupDropZone(lc, (file) => loadBgFile(file, state));
  setupDropZone($('bgPanel'), (file) => loadBgFile(file, state));
  setupDropZone($('widgetPanel'), (file) => loadWidgetFile(file, state));
}
