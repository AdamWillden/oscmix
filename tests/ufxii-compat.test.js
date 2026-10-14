import test from 'node:test';
import assert from 'node:assert/strict';
import {adaptMidiWrite} from '../ufxii-compat.js';
const name = 'Fireface UFX II (23805571) Port';
function encode(reg, val) {
  let word = ((reg << 16) | val) >>> 0;
  let parity = 0;
  for (let i = 0; i < 31; i++) parity ^= word >>> i & 1;
  word = (word | ((parity ^ 1) << 31)) >>> 0;
  const data = new Uint8Array([0xf0, 0, 0x20, 0x0d, 0x10, 0, 0, 0, 0, 0, 0, 0xf7]);
  for (let i = 0; i < 5; i++) data[6 + i] = Math.floor(word / 2 ** (7 * i)) & 0x7f;
  return data;
}
function decode(data) {
  let word = 0;
  for (let i = 0; i < 5; i++) word += data[6 + i] * 2 ** (7 * i);
  let parity = 0;
  for (let i = 0; i < 32; i++) parity ^= word >>> i & 1;
  assert.equal(parity, 1, 'register packet must have odd parity');
  return [word >>> 16 & 0x7fff, word & 0xffff];
}
test('obsolete UFX II dump becomes the two hardware-verified refresh requests', () => {
  const messages = adaptMidiWrite(encode(0x3e03, 0x234a), name);
  assert.deepEqual(messages.map(decode), [[0x3e04, 0x67cd], [0x3e05, 0x3481]]);
});
test('other Fireface models retain their original request', () => {
  for (const model of ['Fireface UFX III (123)', 'Fireface UFX (123)', 'Fireface UFX+ (123)']) {
    const data = encode(0x3e03, 0x234a);
    assert.equal(adaptMidiWrite(data, model)[0], data);
  }
});
test('stereo, reference level, playback level and other values are untouched', () => {
  for (const [reg, value] of [[0x724, 1], [0x728, 1], [0x4903, 0], [0x3e03, 0x67cd]]) {
    const data = encode(reg, value);
    assert.deepEqual(adaptMidiWrite(data, name), [data]);
    assert.equal(adaptMidiWrite(data, name)[0], data);
  }
});
test('meter requests, unrelated SysEx and truncated data pass through', () => {
  for (const data of [new Uint8Array([0xf0,0,0x20,0x0d,0x10,2,0xf7]), new Uint8Array([0xf0,1,0xf7]), new Uint8Array()]) {
    assert.equal(adaptMidiWrite(data, name)[0], data);
  }
});
