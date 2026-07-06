import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function yamlString(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function toFrontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(yamlString).join(', ')}]`);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${yamlString(value)}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

/**
 * Creates a new markdown file for `collection` with pre-filled frontmatter.
 * @param {string} collection - directory under content/, e.g. "blog"
 * @param {string} title - human-readable title, used for the filename slug too
 * @param {Record<string, unknown>} extraFields - collection-specific frontmatter fields
 */
export async function scaffold(collection, title, extraFields = {}) {
  if (!title) {
    console.error('Usage: npm run new:<type> -- "Post title"');
    process.exit(1);
  }

  const slug = slugify(title);
  const dir = `${ROOT}/content/${collection}`;
  const filePath = `${dir}/${slug}.md`;

  if (existsSync(filePath)) {
    console.error(`Refusing to overwrite existing file: content/${collection}/${slug}.md`);
    process.exit(1);
  }

  const frontmatter = toFrontmatter({
    title,
    date: todayISO(),
    tags: [],
    draft: true,
    ...extraFields,
  });

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, `${frontmatter}\nWrite your content here.\n`);
  console.log(`Created content/${collection}/${slug}.md`);
}

export function argTitle() {
  return process.argv.slice(2).join(' ').trim();
}
