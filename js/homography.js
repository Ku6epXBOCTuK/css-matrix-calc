import { round } from './constants.js';

export function computeHomography(state) {
  const w = state.widgetW, h = state.widgetH;
  if (w <= 0 || h <= 0) return null;
  const [p0, p1, p2, p3] = state.corners;

  const a11 = p2.x - p1.x, a12 = p2.x - p3.x;
  const b1 = p1.x + p3.x - p0.x - p2.x;
  const a21 = p2.y - p1.y, a22 = p2.y - p3.y;
  const b2 = p1.y + p3.y - p0.y - p2.y;

  const D = a11 * a22 - a12 * a21;
  if (Math.abs(D) < 1e-10) return null;

  const A = (b1 * a22 - b2 * a12) / D;
  const B = (a11 * b2 - a21 * b1) / D;

  return {
    h00: (p1.x * (A + 1) - p0.x) / w,
    h10: (p1.y * (A + 1) - p0.y) / w,
    h01: (p3.x * (B + 1) - p0.x) / h,
    h11: (p3.y * (B + 1) - p0.y) / h,
    h02: p0.x,
    h12: p0.y,
    h20: A / w,
    h21: B / h,
    h22: 1
  };
}

export function toMatrix3dCSS(H) {
  if (!H) return '/* degenerate configuration */';
  return [
    'transform-origin: 0 0;',
    'transform: matrix3d(',
    `  ${round(H.h00)}, ${round(H.h10)}, 0, ${round(H.h20)},`,
    `  ${round(H.h01)}, ${round(H.h11)}, 0, ${round(H.h21)},`,
    `  0, 0, 1, 0,`,
    `  ${round(H.h02)}, ${round(H.h12)}, 0, ${round(H.h22)}`,
    ');'
  ].join('\n');
}
