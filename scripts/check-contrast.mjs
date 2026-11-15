#!/usr/bin/env node
/**
 * Checks the WCAG contrast of the button palette against the values actually present in
 * src/ui/button.ts, so the numbers cannot drift away from the code.
 *
 * Text must reach 7:1 on every fill; the border must reach 3:1 (non-text minimum).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/ui/button.ts'), 'utf8');

/** Reads `const NAME = ex.Color.fromHex('#rrggbb');` from the button source. */
function palette(name) {
  const match = new RegExp(`const ${name} = ex\\.Color\\.fromHex\\('(#[0-9a-fA-F]{6})'\\)`).exec(
    source,
  );
  if (!match) {
    throw new Error(`colore ${name} non trovato in src/ui/button.ts`);
  }
  return match[1];
}

function channel(value) {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const r = channel(Number.parseInt(hex.slice(1, 3), 16));
  const g = channel(Number.parseInt(hex.slice(3, 5), 16));
  const b = channel(Number.parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const TEXT_MIN = 7;
const EDGE_MIN = 3;

const checks = [
  {
    label: 'testo su fondo normale',
    fg: palette('TEXT_COLOR'),
    bg: palette('FILL_IDLE'),
    min: TEXT_MIN,
  },
  {
    label: 'testo su fondo hover',
    fg: palette('TEXT_HOVER'),
    bg: palette('FILL_HOVER'),
    min: TEXT_MIN,
  },
  {
    label: 'testo su fondo premuto',
    fg: palette('TEXT_HOVER'),
    bg: palette('FILL_PRESSED'),
    min: TEXT_MIN,
  },
  {
    label: 'testo disabilitato',
    fg: palette('TEXT_DISABLED'),
    bg: palette('FILL_DISABLED'),
    min: TEXT_MIN,
  },
  { label: 'bordo normale', fg: palette('EDGE_IDLE'), bg: palette('FILL_IDLE'), min: EDGE_MIN },
  { label: 'bordo hover', fg: palette('EDGE_HOVER'), bg: palette('FILL_HOVER'), min: EDGE_MIN },
  {
    label: 'bordo premuto',
    fg: palette('EDGE_PRESSED'),
    bg: palette('FILL_PRESSED'),
    min: EDGE_MIN,
  },
];

let failed = 0;
for (const check of checks) {
  const ratio = contrast(check.fg, check.bg);
  const ok = ratio >= check.min;
  if (!ok) {
    failed += 1;
  }
  const status = ok ? 'ok  ' : 'FAIL';
  console.log(
    `${status} ${check.label}: ${ratio.toFixed(2)}:1 (minimo ${check.min}:1) ${check.fg} su ${check.bg}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} controlli di contrasto falliti`);
  process.exit(1);
}

console.log(`\ncontrasto: ${checks.length} controlli superati`);
