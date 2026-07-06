import { execFileSync } from 'node:child_process';

/** Returns the ISO commit date of the last commit that touched `filePath`, or null if unavailable. */
export function getLastUpdated(filePath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: new URL('..', import.meta.url).pathname,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}
