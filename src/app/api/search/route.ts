import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const zhNormalizationCache = new Map<string, string>();
const hanText = /^\p{Script=Han}+$/u;
const searchSegments = /[\p{Script=Han}]+|[\p{Letter}\p{Number}_'-]+/gu;

function normalizeSearchToken(token: string, prop = ''): string {
  const cacheKey = `${prop}:${token}`;
  const cached = zhNormalizationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const normalized = token
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  zhNormalizationCache.set(cacheKey, normalized);
  return normalized;
}

function tokenizeHanText(text: string, prop?: string): string[] {
  const chars = Array.from(text);
  const tokens = chars.map((char) => normalizeSearchToken(char, prop));

  for (let i = 0; i < chars.length - 1; i += 1) {
    tokens.push(normalizeSearchToken(`${chars[i]}${chars[i + 1]}`, prop));
  }

  return tokens;
}

const zhTokenizer = {
  language: 'zh',
  normalizationCache: zhNormalizationCache,
  tokenize(raw: string, language?: string, prop?: string): string[] {
    if (language && language !== zhTokenizer.language) {
      return [];
    }

    const tokens: string[] = [];

    for (const match of raw.matchAll(searchSegments)) {
      const segment = match[0];
      tokens.push(
        ...(hanText.test(segment)
          ? tokenizeHanText(segment, prop)
          : [normalizeSearchToken(segment, prop)]),
      );
    }

    return Array.from(new Set(tokens.filter(Boolean)));
  },
};

export const { GET } = createFromSource(source, {
  localeMap: {
    en: 'english',
    // Orama has no built-in "chinese" language key; CJK text needs a tokenizer.
    zh: {
      components: {
        tokenizer: zhTokenizer,
      },
    },
  },
});
