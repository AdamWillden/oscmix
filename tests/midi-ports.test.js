import test from 'node:test';
import assert from 'node:assert/strict';
import {midiPorts} from '../midi-ports.js';
const name = 'Fireface UFX II (23805571) Port';
function access(inputNames, outputNames = inputNames) {
  return {
    inputs: new Map(inputNames.map((name, i) => [i, {id: `input-${i}`, name}])),
    outputs: new Map(outputNames.map((name, i) => [i, {id: `output-${i}`, name}]))
  };
}
test('duplicate ALSA names pair with distinct outputs, including the control port', () => {
  const ports = midiPorts(access(['Midi Through', name, name, name]));
  assert.deepEqual(ports.map(p => p.output.id), ['output-0', 'output-1', 'output-2', 'output-3']);
  assert.equal(ports[3].label, name + ' [port 3/3]');
  assert.equal(ports[1].label, name + ' [port 1/3]');
});
test('unique names match by name even when output enumeration differs', () => {
  const ports = midiPorts(access(['A', 'B'], ['B', 'A']));
  assert.deepEqual(ports.map(p => p.output.id), ['output-1', 'output-0']);
  assert.deepEqual(ports.map(p => p.label), ['A', 'B']);
});
test('missing output partners are omitted instead of reusing an output', () => {
  const ports = midiPorts(access([name, name, name], [name, name]));
  assert.equal(ports.length, 2);
  assert.equal(new Set(ports.map(p => p.output.id)).size, 2);
});
test('empty device lists return no connections', () => {
  assert.deepEqual(midiPorts(access([])), []);
});
