import type { Choice } from './types';
export const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
/** Nearest enabled option to a continuous, zero-based segment position. */
export function nearestEnabled(options: readonly Choice[], position: number): number {
  let best = -1, distance = Infinity;
  options.forEach((option, index) => {
    const next = Math.abs(index - position);
    if (!option.disabled && next < distance) { best = index; distance = next; }
  });
  return best;
}
