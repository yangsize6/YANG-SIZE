// Preserve the original club artwork exactly: each SVG shows only the
// bottom-right logo region of its source booklet page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'assets', 'logos');
mkdirSync(output, { recursive: true });
const backgrounds = join(root, 'assets', 'club-backgrounds');
mkdirSync(backgrounds, { recursive: true });

const clubs = ['INSIM', 'IMMIX', 'CNN', 'MCSIM', 'MYSIM', 'SIS', 'SKC', 'VNC'];
const bounds = [
  [470, 972, 138, 108], [445, 963, 163, 117],
  [481, 970, 127, 110], [463, 961, 145, 119],
  [482, 943, 126, 137], [479, 973, 129, 107],
  [446, 975, 162, 105], [458, 961, 150, 119],
];
for (const [index, club] of clubs.entries()) {
  const page = index + 3;
  const [x, y, width, height] = bounds[index];
  const jpg = readFileSync(join(root, 'assets', `page-${page}.jpg`)).toString('base64');
  // Original artwork: 608 × 1080. The logo sits at the lower-right corner.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${club} logo"><image href="data:image/jpeg;base64,${jpg}" x="-${x}" y="-${y}" width="608" height="1080" /></svg>`;
  writeFileSync(join(output, `${club.toLowerCase()}.svg`), svg);
  // Upper-left area of each original introduction page: only sky/planet,
  // safely above and to the left of the page's headings and photographs.
  const background = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 190"><image href="data:image/jpeg;base64,${jpg}" width="608" height="1080" /></svg>`;
  writeFileSync(join(backgrounds, `${club.toLowerCase()}.svg`), background);
}
