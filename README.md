# nagasha.dev

Jemimah's personal site — a public, linkable record of open source work on Bitcoin and Lightning. Built with [Astro](https://astro.build), content collections, and as few dependencies as the feature list allows.

Live at [nagasha.dev](https://nagasha.dev).

## Philosophy

Calm, minimal, fast. Everything lives in Git as markdown — no database, no CMS. Publishing a post means adding a file, not touching a component. See the project spec this repo was built from for the full rationale.

## Install

Requires Node.js 22+ (developed against Node 24).

```bash
npm install
npm run dev
```

`npm run dev` (and `npm run build`) first run `scripts/fetch-pinned-repos.mjs`, which fetches your GitHub pinned repos for the homepage. It needs a `GITHUB_TOKEN` or `GH_PAT` environment variable to hit the GitHub API; without one (or if the network is unavailable), it falls back to the committed `public/data/pinned-repos.fallback.json` and the build still succeeds.

Local search (Pagefind) only works after a full build — `astro dev` does not run the `postbuild` indexing step. This is expected; see [Known limitations](#known-limitations).

## Build & deploy

```bash
npm run build    # astro build, then pagefind indexing via postbuild
npm run preview  # serve the production build locally
```

Deployment to GitHub Pages happens automatically via `.github/workflows/deploy.yml` on every push to `main`, using [`withastro/action`](https://github.com/withastro/action). The site is configured for the custom domain `nagasha.dev` (see `public/CNAME` and `site` in `astro.config.mjs`) with no `base` path, which means the same build output deploys unmodified to Cloudflare Pages, Netlify, or Vercel — just point any of them at this repo with build command `npm run build` and output directory `dist`.

## Authoring content

Everything under `content/` is markdown (or MDX where components are useful) with YAML frontmatter, validated by the schemas in `src/content.config.ts`.

| Command | Creates |
|---|---|
| `npm run new:blog -- "Post title"` | `content/blog/post-title.md` |
| `npm run new:til -- "Short title"` | `content/til/short-title.md` |
| `npm run new:worklog -- "Title" --project=polar` | `content/worklog/title.md` (`--project` is optional: `polar`, `lnd`, `bitdevs`, `btrust`) |
| `npm run new:project -- "Project name"` | `content/projects/project-name.md` |

Every scaffolded file starts with `draft: true` and today's date — flip `draft` to `false` (or remove it) when it's ready to publish. `notes/`, `lists/`, and `talks/` don't have scaffolding scripts since they're edited less often; copy an existing file in that directory as a starting point.

Canonical tags live in `src/data/tags.ts` — using a tag outside that list fails the build (by design, to keep the tag index meaningful). Add new tags there first.

### Content collections

- `content/blog/` — long-form posts. Supports Mermaid diagrams (loaded client-side only on pages that use one), KaTeX math, footnotes, syntax highlighting, reading time, and a table of contents, all automatic.
- `content/til/` — quick, dated notes.
- `content/worklog/` — chronological, dated entries, optionally tagged with a `project` and linking out to PRs/issues via `links`.
- `content/notes/` — longer-running working notes.
- `content/lists/` — curated, wiki-like lists (`items` array in frontmatter).
- `content/projects/` — evergreen project pages; automatically surface related posts/TILs/worklog entries by shared tag.
- `content/talks/` — talks, interviews, podcasts, guest posts, and press mentions (`type` field distinguishes them). Index-only, no per-entry pages — link out to the source.
- `content/pages/` — `about.md` and `now.md`, the two standalone pages.

## Project structure

```
content/       All markdown content — the only thing you need to touch to publish
public/        Static assets, CNAME, robots.txt, favicon, pinned-repos fallback
scripts/       Build-time and scaffolding Node scripts (no framework dependency)
src/
  content.config.ts   Content collection schemas
  data/               Canonical tags, generated pinned-repos.json (gitignored)
  lib/                Small framework-free helper functions and remark plugins
  layouts/            Page-level layouts (Base, Post, Entry, Project)
  components/         .astro components
  pages/              File-based routes
  styles/global.css   Theme tokens, typography, KaTeX overrides
```

## Customization

- **Colors/fonts**: `src/styles/global.css` (CSS custom properties) and the `fonts` array in `astro.config.mjs` (self-hosted via Astro's built-in Fonts API — no Google Fonts requests at runtime).
- **Nav links**: `src/components/Nav.astro`.
- **Canonical tags**: `src/data/tags.ts`.
- **Domain**: update `site` in `astro.config.mjs` and `public/CNAME`.

## Known limitations

- Pagefind search is a no-op in `astro dev` — its index only exists after `npm run build`.
- The GitHub pinned-repos fetch requires a `GITHUB_TOKEN`/`GH_PAT` env var; without one it silently uses the static fallback file, which you should update by hand occasionally.
- Sample content across every collection is clearly placeholder — PR numbers, issue links, and some URLs are marked as samples and should be replaced with real links before treating any entry as a verifiable claim.

## License

MIT — see `LICENSE`. Fork it, strip the sample content, and make it yours.
