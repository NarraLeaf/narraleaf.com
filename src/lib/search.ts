import type { Locale } from './i18n';

/**
 * How each language's search index splits text into words, shared by the build
 * that writes the index (`src/app/api/search/[locale]/route.ts`) and the server
 * that searches it (`src/app/api/search/route.ts`). A query only finds what the
 * index holds if both sides cut it up the same way.
 *
 * Orama tokenizes English itself. It has no tokenizer for Chinese or Japanese,
 * and asked for one by name it throws, which is how Japanese search came to
 * answer every query with a 500. Neither language puts spaces between words, so
 * a run of CJK characters is indexed as every character and every pair of
 * neighbouring characters: a two-character word is found whole, a longer one
 * through its pairs, with no dictionary to keep in step with the docs.
 */

const cjkRun = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ーｰ]+$/u;
// `ー` belongs to no script. Left out of the CJK class it would end the run in
// データ and start a "word" that swallows all the kana after it.
const searchSegments =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ーｰ]+|[\p{Letter}\p{Number}_'-]+/gu;

function createCjkTokenizer(language: Exclude<Locale, 'en'>) {
  const normalizationCache = new Map<string, string>();

  function normalize(token: string, prop = ''): string {
    const cacheKey = `${prop}:${token}`;
    const cached = normalizationCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const normalized = token
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '');

    normalizationCache.set(cacheKey, normalized);
    return normalized;
  }

  function tokenizeCjkRun(text: string, prop?: string): string[] {
    const chars = Array.from(text);
    const tokens = chars.map((char) => normalize(char, prop));

    for (let i = 0; i < chars.length - 1; i += 1) {
      tokens.push(normalize(`${chars[i]}${chars[i + 1]}`, prop));
    }

    return tokens;
  }

  // `language` is not a constant: loading a saved index writes the index's
  // language back onto its tokenizer, so each database gets a tokenizer of its own.
  const tokenizer = {
    language: language as string,
    normalizationCache,
    tokenize(raw: string, requested?: string, prop?: string): string[] {
      if (requested && requested !== tokenizer.language) {
        return [];
      }

      const tokens: string[] = [];

      for (const match of raw.matchAll(searchSegments)) {
        const segment = match[0];
        tokens.push(...(cjkRun.test(segment) ? tokenizeCjkRun(segment, prop) : [normalize(segment, prop)]));
      }

      return Array.from(new Set(tokens.filter(Boolean)));
    },
  };

  return tokenizer;
}

/**
 * The Orama options for a language's index, given both when it is built and
 * when it is loaded.
 *
 * Sorting is off because results are only ever ranked by relevance. Left on,
 * Orama keeps a sorted copy of every field, a fifth of the saved index.
 */
export function searchDatabaseOptions(locale: Locale) {
  const sort = { enabled: false };

  if (locale === 'en') {
    return { language: 'english', sort } as const;
  }

  return { components: { tokenizer: createCjkTokenizer(locale) }, sort };
}

/** Where a language's saved index is published. */
export function searchIndexPath(locale: Locale): string {
  return `/api/search/${locale}`;
}
