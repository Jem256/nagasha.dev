import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(input: string): string {
  return input.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
}

/** Greedy word-wraps `text` into lines that fit `maxChars` characters. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function renderOgImage({ title, kicker }: { title: string; kicker: string }): Buffer {
  const lines = wrapText(title, 28).slice(0, 3);
  const lineHeight = 76;
  const startY = HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;

  const titleTspans = lines
    .map((line, i) => `<tspan x="80" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#121212" />
      <rect x="0" y="0" width="10" height="${HEIGHT}" fill="#f472b6" />
      <text x="80" y="120" font-family="sans-serif" font-size="28" fill="#a1a1aa" letter-spacing="1">${escapeXml(kicker)}</text>
      <text font-family="sans-serif" font-weight="700" font-size="64" fill="#e8e8ea">${titleTspans}</text>
      <text x="80" y="${HEIGHT - 60}" font-family="sans-serif" font-size="26" fill="#f472b6">nagasha.dev</text>
    </svg>
  `;

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}
