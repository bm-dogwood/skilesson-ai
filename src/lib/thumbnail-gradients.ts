// Premium gradient configurations for video thumbnails
// Each evokes a different mountain/snow scene

export const thumbnailGradients = [
  // 0 - Dawn mountain: pink/orange sky over snow
  'bg-gradient-to-br from-rose-900/80 via-orange-800/60 to-sky-900',
  // 1 - Bluebird day: clear sky, white peaks
  'bg-gradient-to-b from-sky-400 via-sky-600 to-slate-100',
  // 2 - Powder day: soft grey clouds, fresh snow
  'bg-gradient-to-br from-slate-400 via-slate-300 to-white',
  // 3 - Sunset slopes: golden hour over mountain
  'bg-gradient-to-br from-amber-700 via-orange-600 to-indigo-900',
  // 4 - Storm rolling in: dramatic dark clouds
  'bg-gradient-to-b from-slate-800 via-slate-600 to-slate-400',
  // 5 - Night skiing: dark blue with artificial light glow
  'bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-800/40',
  // 6 - Spring conditions: warm bright sky, soft snow
  'bg-gradient-to-b from-sky-300 via-cyan-200 to-emerald-100',
  // 7 - Backcountry: deep wilderness, alpine blue
  'bg-gradient-to-br from-slate-900 via-emerald-900/60 to-sky-800',
] as const;

export type ThumbnailVariant = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function getGradient(variant: number): string {
  return thumbnailGradients[variant % thumbnailGradients.length];
}
