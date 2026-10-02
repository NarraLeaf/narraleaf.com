import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from 'zod';
import { gitLastModified } from './src/lib/git-last-modified';

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const project = defineDocs({
  dir: 'content/project',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * Blog posts: one file per post, `content/blog/<slug>.en.mdx` beside its
 * `<slug>.zh.mdx` and `<slug>.ja.mdx` translations. A post that needs its own
 * images can be a folder instead, `content/blog/<slug>/index.en.mdx`, with the
 * images next to it. The slug is the URL: `/blog/<slug>`, `/zh/blog/<slug>`
 * and `/ja/blog/<slug>`.
 */
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    // Required here, unlike docs: the post list and the link preview both show it.
    description: z.string(),
    /** `YYYY-MM-DD`. Posts are listed newest first. */
    date: z.coerce.date(),
    authors: z.array(z.string()).default([]),
    /**
     * Cover image, a path under `public/`. It heads the post, shows in the list,
     * and is the link preview — so make it 1200x630. Without one, a preview is
     * generated from the title.
     */
    image: z.string().optional(),
    /** Shown by `next dev`, left out of production builds. */
    draft: z.boolean().default(false),
  }),
});

export default defineConfig({
  // Every page gets `lastModified`, its last commit date, for the sitemap's
  // `lastmod`. See src/lib/git-last-modified.ts for why the date can be absent.
  plugins: [lastModified({ versionControl: gitLastModified })],
  mdxOptions: {
    // MDX options
  },
});
