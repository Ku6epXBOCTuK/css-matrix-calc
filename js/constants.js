export const COLORS = {
  fieldBg: '#0a0e14',
  accent: '#58a6ff',
  widgetFill: 'rgba(88,166,255,0.12)',
  widgetStroke: 'rgba(88,166,255,0.4)',
  polygonFill: 'rgba(88,166,255,0.1)',
  gridLine: 'rgba(255,255,255,0.06)'
};

export const LABELS = ['TL', 'TR', 'BR', 'BL'];

export const FIELD_PADDING = 140;

export const ROUND_DIGITS = 6;
export const round = v => parseFloat(v.toFixed(ROUND_DIGITS));
