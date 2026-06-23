export const defaultState = {
  fieldW: 1920, fieldH: 1080,
  widgetW: 400, widgetH: 300,
  corners: [
    { x: 300, y: 200 },
    { x: 1620, y: 150 },
    { x: 1580, y: 920 },
    { x: 340, y: 950 }
  ]
};

export const state = {
  fieldW: 1920, fieldH: 1080,
  widgetW: 400, widgetH: 300,
  corners: [
    { x: 300, y: 200 },
    { x: 1620, y: 150 },
    { x: 1580, y: 920 },
    { x: 340, y: 950 }
  ]
};

export function resetState() {
  state.fieldW = defaultState.fieldW;
  state.fieldH = defaultState.fieldH;
  state.widgetW = defaultState.widgetW;
  state.widgetH = defaultState.widgetH;
  defaultState.corners.forEach((c, i) => {
    state.corners[i] = { x: c.x, y: c.y };
  });
}
