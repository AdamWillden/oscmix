/* Local compatibility fix for the upstream static preview's UFX II refresh.
 * Only substitute the obsolete dump request; leave all control writes alone.
 */
function registerWrite(reg, val) {
  let word = ((reg & 0x7fff) << 16 | (val & 0xffff)) >>> 0;
  let parity = word ^ (word >>> 16);
  parity ^= parity >>> 8;
  parity ^= parity >>> 4;
  parity ^= parity >>> 2;
  parity ^= parity >>> 1;
  word = (word | ((~parity & 1) << 31)) >>> 0;
  const packet = new Uint8Array([0xf0, 0, 0x20, 0x0d, 0x10, 0, 0, 0, 0, 0, 0, 0xf7]);
  for (let i = 0; i < 5; i++) packet[6 + i] = Math.floor(word / 2 ** (7 * i)) & 0x7f;
  return packet;
}
export function adaptMidiWrite(data, portName) {
  if (!/^Fireface UFX II(?:\s|\()/.test(portName) || data.length !== 12 ||
      data[0] !== 0xf0 || data[1] !== 0 || data[2] !== 0x20 ||
      data[3] !== 0x0d || data[4] !== 0x10 || data[5] !== 0 || data[11] !== 0xf7)
    return [data];
  let word = 0;
  for (let i = 0; i < 5; i++) word += data[6 + i] * 2 ** (7 * i);
  if (((word >>> 16) & 0x7fff) !== 0x3e03 || (word & 0xffff) !== 0x234a)
    return [data];
  return [registerWrite(0x3e04, 0x67cd), registerWrite(0x3e05, 0x3481)];
}
