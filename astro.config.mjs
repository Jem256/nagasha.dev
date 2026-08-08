import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

import remarkReadingTime from './src/lib/remark-reading-time.mjs';
import remarkMermaidFlag from './src/lib/remark-mermaid-flag.mjs';

export default defineConfig({
  site: 'https://nagasha.dev',
  output: 'static',

  integrations: [mdx(), sitemap()],

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkReadingTime, remarkMermaidFlag],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: 'heading-anchor', ariaHidden: true, tabIndex: -1 } }],
        rehypeKatex,
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
      gfm: true,
      smartypants: true,
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    // Mermaid needs its fenced code block left as plain `<pre><code class="language-mermaid">`
    // (not Shiki-highlighted) so MermaidLoader's querySelector can find and replace it client-side.
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
  },

});
