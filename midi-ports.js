/* ALSA may give multiple MIDI ports the same name. Match each input to
 * a distinct output in enumeration order, and label duplicate names. */
export function midiPorts(access) {
  const outputsByName = new Map();
  for (const output of access.outputs.values()) {
    const name = output.name ?? "";
    if (!outputsByName.has(name)) outputsByName.set(name, []);
    outputsByName.get(name).push(output);
  }
  const inputs = [...access.inputs.values()];
  const counts = new Map();
  for (const input of inputs) {
    const name = input.name ?? "";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const seen = new Map();
  const ports = [];
  for (const input of inputs) {
    const name = input.name ?? "";
    const index = (seen.get(name) ?? 0) + 1;
    seen.set(name, index);
    const output = outputsByName.get(name)?.shift();
    if (!output) continue;
    const suffix = counts.get(name) > 1 ? ` [port ${index}/${counts.get(name)}]` : "";
    ports.push({label: (input.name ?? input.id) + suffix, input, output});
  }
  return ports;
}
