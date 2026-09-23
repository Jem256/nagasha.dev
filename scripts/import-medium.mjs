import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Parser from 'rss-parser';
import TurndownService from 'turndown';
import { slugify, toFrontmatter } from './lib/scaffold.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FEED_URL = 'https://medium.com/feed/@nagasha';

const TAG_MAP = {
  bitcoin: 'bitcoin',
  blockchain: 'bitcoin',
  'blockchain-development': 'bitcoin',
  taproot: 'taproot',
  'taproot-assets-protocol': 'taproot',
  'lightning-network': 'lightning',
  polar: 'polar',
};

function mapTags(categories = []) {
  const tags = categories.map((c) => TAG_MAP[c]).filter(Boolean);
  return [...new Set(tags)];
}

function canonicalize(link) {
  const url = new URL(link);
  url.search = '';
  return url.toString();
}

function toISODate(pubDate) {
  return new Date(pubDate).toISOString().split('T')[0];
}

function preToCode(node) {
  let text = '';
  for (const child of node.childNodes) {
    text += child.nodeName === 'BR' ? '\n' : child.textContent;
  }
  return text;
}

function stripTrackingPixel(html) {
  return html.replace(/<img[^>]*src="https:\/\/medium\.com\/_\/stat\?[^"]*"[^>]*>/g, '');
}

async function main() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);
  const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

  // Medium exports code snippets as bare <pre> (no <code> child, <br> for line breaks),
  // which turndown's default rule doesn't recognize as a code block.
  turndown.addRule('barePre', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_content, node) => `\n\n\`\`\`\n${preToCode(node)}\n\`\`\`\n\n`,
  });

  const dir = `${ROOT}/content/blog`;
  await mkdir(dir, { recursive: true });

  for (const item of feed.items) {
    const slug = slugify(item.title);
    const filePath = `${dir}/${slug}.md`;

    if (existsSync(filePath)) {
      console.log(`Skipping (already exists): content/blog/${slug}.md`);
      continue;
    }

    const frontmatter = toFrontmatter({
      title: item.title,
      date: toISODate(item.pubDate),
      tags: mapTags(item.categories),
      draft: false,
      canonicalUrl: canonicalize(item.link),
    });

    const html = stripTrackingPixel(item['content:encoded'] ?? item.content ?? '');
    const body = turndown.turndown(html);

    await writeFile(filePath, `${frontmatter}\n${body}\n`);
    console.log(`Created content/blog/${slug}.md`);
  }
}

main();
