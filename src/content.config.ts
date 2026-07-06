import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TAGS } from './data/tags';

const tag = z.enum(TAGS);

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(tag).default([]),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
  schema: baseSchema.extend({
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/til' }),
  schema: baseSchema.omit({ description: true, updated: true }),
});

const worklog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/worklog' }),
  schema: baseSchema.extend({
    project: z.enum(['polar', 'lnd', 'bitdevs', 'btrust']).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/notes' }),
  schema: baseSchema,
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/lists' }),
  schema: baseSchema.extend({
    items: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url().optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects' }),
  schema: baseSchema.extend({
    status: z.enum(['active', 'archived']).default('active'),
    role: z.string().optional(),
    repo: z.string().url().optional(),
    website: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/talks' }),
  schema: z.object({
    title: z.string(),
    outlet: z.string(),
    date: z.coerce.date(),
    url: z.string().url(),
    type: z.enum(['talk', 'interview', 'podcast', 'guest-post', 'mention']),
    tags: z.array(tag).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { blog, til, worklog, notes, lists, projects, talks, pages };
