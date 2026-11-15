import * as ex from 'excalibur';

// Scaffold only: this file proves the toolchain (TS + Vite + Excalibur)
// builds and loads on a phone through the tunnel. Gameplay arrives with the
// apply phase of the OpenSpec change.
console.info(`excalibur loaded · displayMode enum: ${String(ex.DisplayMode.Fixed)}`);

const note = document.getElementById('scaffold-note');
const line = note?.querySelector('span');
if (line) {
  line.textContent = 'toolchain pronta (TS + Vite + Excalibur) · nessun gameplay ancora';
}
