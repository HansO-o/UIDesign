import { strict as assert } from 'node:assert';
import { clamp, nearestEnabled } from '../components/src/math.ts';
const choices = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];
assert.equal(clamp(-2, 0, 2), 0);
assert.equal(clamp(5, 0, 2), 2);
assert.equal(clamp(1, 0, 2), 1);
assert.equal(nearestEnabled(choices, 1.9), 2);
assert.equal(nearestEnabled(choices, 1), 0); // ties choose the first option
assert.equal(nearestEnabled([{ value: 'x', label: 'X', disabled: true }], 0), -1);
assert.equal(nearestEnabled([], 0), -1);
console.log('Selection math tests passed');
