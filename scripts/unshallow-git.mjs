// Gives the build the repository's whole history when it was cloned shallowly,
// so src/lib/git-last-modified.ts can date every page for the sitemap.
//
// Vercel clones only the last few commits. Its VERCEL_DEEP_CLONE switch made
// every build of this site fail at "There was a permanent problem cloning the
// repo", so the build fetches the rest itself: the repository is public, and
// the history is small. In a full clone, which is any local checkout, this does
// nothing.
//
// Nothing here may fail the build. If the history cannot be had, the pages go
// out without lastmod, which is how the site shipped before it had one, and the
// date lookup says so in the build log.

import { execFileSync } from 'node:child_process';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/** Build logs are kept: a remote URL can carry a token, so none is printed with one. */
function redact(text) {
  return String(text).replace(/\/\/[^@/\s]*@/g, '//');
}

function isShallow() {
  return git('rev-parse', '--is-shallow-repository') === 'true';
}

function sources() {
  const found = [];
  try {
    if (git('remote').split('\n').includes('origin')) found.push('origin');
  } catch {
    // No remotes configured; fall through to the one Vercel describes.
  }
  const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG } = process.env;
  if (VERCEL_GIT_PROVIDER === 'github' && VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG) {
    found.push(`https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}.git`);
  }
  return found;
}

try {
  if (!isShallow()) process.exit(0);
} catch {
  console.warn('[unshallow] Not a git checkout, so pages get no lastmod.');
  process.exit(0);
}

const commit = git('rev-parse', 'HEAD');
for (const source of sources()) {
  try {
    // The commit being built, by hash: a branch name may not exist under that
    // name at the source, and the history needed is exactly this commit's.
    git('fetch', '--unshallow', '--no-tags', '--quiet', source, commit);
    if (!isShallow()) {
      console.log(`[unshallow] Fetched the full history from ${redact(source)}.`);
      process.exit(0);
    }
  } catch (error) {
    console.warn(`[unshallow] Could not fetch the history from ${redact(source)}:`, redact(error.stderr?.trim() || error.message));
  }
}
console.warn('[unshallow] The clone is still shallow, so pages get no lastmod.');
