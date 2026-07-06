import { writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_PATH = `${ROOT}/src/data/pinned-repos.json`;
const FALLBACK_PATH = `${ROOT}/public/data/pinned-repos.fallback.json`;
const GITHUB_USER = 'Jem256';

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage { name }
          }
        }
      }
    }
  }
`;

async function fetchPinnedRepos() {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT;
  if (!token) throw new Error('No GITHUB_TOKEN/GH_PAT set');

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USER } }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

  const json = await res.json();
  const nodes = json?.data?.user?.pinnedItems?.nodes;
  if (!Array.isArray(nodes)) throw new Error('Unexpected GitHub API response shape');

  return nodes.map((r) => ({
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stargazerCount,
    language: r.primaryLanguage?.name ?? null,
  }));
}

async function main() {
  await mkdir(`${ROOT}/src/data`, { recursive: true });

  try {
    const repos = await fetchPinnedRepos();
    await writeFile(OUT_PATH, JSON.stringify(repos, null, 2));
    console.log(`[fetch-pinned-repos] wrote ${repos.length} repos from GitHub API`);
  } catch (err) {
    console.warn(`[fetch-pinned-repos] falling back to static data: ${err.message}`);
    await copyFile(FALLBACK_PATH, OUT_PATH);
  }
}

await main();
