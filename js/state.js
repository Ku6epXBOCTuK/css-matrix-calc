export const defaultState = {
  fieldW: 1920, fieldH: 1080,
  widgetW: 400, widgetH: 300,
  corners: [
    { x: 300, y: 200 },
    { x: 1620, y: 150 },
    { x: 1580, y: 920 },
    { x: 340, y: 950 }
  ],
  bgImage: null,
  objectFit: 'contain',
  widgetImage: null
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const state = deepClone(defaultState);

export function resetState() {
  const clone = deepClone(defaultState);
  Object.assign(state, clone);
}
