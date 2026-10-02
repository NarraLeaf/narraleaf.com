import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * When each content file last changed, read from git while the MDX compiles.
 *
 * The date is what the sitemap gives as a page's `lastmod`, so a search engine
 * can tell which of the site's pages are worth fetching again. A wrong date is
 * worse than none: a crawler that finds `lastmod` unreliable learns to ignore it
 * for the whole site. Two things in this file exist for that reason.
 *
 * - A shallow clone yields no dates at all. In one, every file untouched since
 *   the oldest commit fetched appears to have been written by that commit, so
 *   hundreds of pages would claim a change they never had. Vercel clones
 *   shallowly; `yarn build` first fetches the rest of the history with
 *   scripts/unshallow-git.mjs, and if that fails the sitemap goes out without
 *   dates and the build says so.
 * - The date is the commit date, not the author date: a change that was
 *   written earlier and cherry-picked or rebased onto `master` reached the site
 *   when it was committed there.
 *
 * The history is read once, in a single `git log`, rather than once per file:
 * the site has some thousand pages and the loader asks for each of them.
 */

let history: Promise<Map<string, Date> | null> | undefined;

/** One spelling per file: git prints `D:/x/y`, the loader may pass `d:\x\y`. */
function fileKey(file: string): string {
  const resolved = path.resolve(file);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function git(args: string[], cwd: string): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

async function readHistory(cwd: string): Promise<Map<string, Date> | null> {
  try {
    if (git(['rev-parse', '--is-shallow-repository'], cwd).trim() !== 'false') {
      console.warn(
        '[last-modified] This is a shallow clone, so pages get no lastmod. `yarn build` fetches the history first (scripts/unshallow-git.mjs).',
      );
      return null;
    }

    const root = git(['rev-parse', '--show-toplevel'], cwd).trim();
    // Newest first: a commit's date line (marked with a NUL), then the files it
    // touched. The first time a file appears is its most recent change. Renames
    // count as a new file, because a moved page is a new address.
    const log = git(['log', '--format=%x00%cI', '--name-only', '--no-renames', '--', 'content'], root);
    const dates = new Map<string, Date>();
    let date: Date | undefined;
    for (const line of log.split('\n')) {
      if (line.startsWith('\0')) {
        date = new Date(line.slice(1));
      } else if (line && date) {
        const key = fileKey(path.join(root, line));
        if (!dates.has(key)) dates.set(key, date);
      }
    }
    return dates;
  } catch (error) {
    console.warn('[last-modified] Could not read the git history, so pages get no lastmod.', error);
    return null;
  }
}

/** The commit date of the last change to `file`, or null when there is none to trust. */
export async function gitLastModified(file: string): Promise<Date | null> {
  history ??= readHistory(path.dirname(path.resolve(file)));
  const dates = await history;
  return dates?.get(fileKey(file)) ?? null;
}
