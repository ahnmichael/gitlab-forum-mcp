import { z } from "zod";
import type { RegisterFn } from "../types.js";

export const registerSearch: RegisterFn = (server, ctx) => {
  const schema = z.object({
    query: z.string().min(1).describe("Search query"),
    with_private: z.boolean().optional(),
    max_results: z.number().int().min(1).max(50).optional(),
  });

  server.registerTool(
    "discourse_search",
    {
      title: "Discourse Search",
      description: "Search site content.",
      inputSchema: schema.shape,
    },
    async (args, _extra: any) => {
      const { query, with_private = false, max_results = 10 } = args;
      const { base, client } = ctx.siteState.ensureSelectedSite();
      const q = new URLSearchParams();
      q.set("expanded", "true");
      const fullQuery = ctx.defaultSearchPrefix ? `${ctx.defaultSearchPrefix} ${query}` : query;
      q.set("q", fullQuery);
      
      // Debug logging
      ctx.logger?.debug(`Search query: "${query}"`);
      ctx.logger?.debug(`Full query with prefix: "${fullQuery}"`);
      ctx.logger?.debug(`Search URL: ${base}/search.json?${q.toString()}`);
      
      try {
        const data = (await client.get(`/search.json?${q.toString()}`)) as any;
        
        // Debug the response structure
        ctx.logger?.debug(`Search response keys: ${Object.keys(data || {}).join(', ')}`);
        ctx.logger?.debug(`Topics found: ${data?.topics?.length || 0}`);
        ctx.logger?.debug(`Posts found: ${data?.posts?.length || 0}`);
        
        const topics: any[] = data?.topics || [];
        const posts: any[] = data?.posts || [];

        // If no topics but we have posts, we can extract topic info from posts
        let items = topics.map((t) => ({
          type: "topic" as const,
          id: t.id,
          title: t.title || t.fancy_title || `Topic ${t.id}`,
          slug: t.slug || String(t.id),
        })) as Array<{ type: "topic"; id: number; title: string; slug: string }>;

        // If we don't have enough topics, supplement with unique topics from posts
        if (items.length < max_results && posts.length > 0) {
          const existingTopicIds = new Set(items.map(t => t.id));
          const postTopics = posts
            .filter(p => p.topic_id && !existingTopicIds.has(p.topic_id))
            .map(p => ({
              type: "topic" as const,
              id: p.topic_id,
              title: `Post topic ${p.topic_id}`, // We don't have the topic title from post
              slug: String(p.topic_id),
            }));
          
          // Add unique post topics up to our limit
          const seenIds = new Set();
          for (const pt of postTopics) {
            if (items.length >= max_results) break;
            if (!seenIds.has(pt.id)) {
              seenIds.add(pt.id);
              items.push(pt);
            }
          }
        }

        items = items.slice(0, max_results);

        const lines: string[] = [];
        if (items.length === 0) {
          lines.push(`No results found for "${query}"`);
          // Add some debug info about what we got
          if (posts.length > 0) {
            lines.push(`Found ${posts.length} posts but no direct topics`);
          }
        } else {
          lines.push(`Top results for "${query}":`);
          let idx = 1;
          for (const it of items) {
            const url = `${base}/t/${it.slug}/${it.id}`;
            lines.push(`${idx}. ${it.title} – ${url}`);
            idx++;
          }
        }

        const jsonFooter = {
          results: items.map((it) => ({ id: it.id, url: `${base}/t/${it.slug}/${it.id}`, title: it.title })),
        };
        const text = lines.join("\n") + "\n\n```json\n" + JSON.stringify(jsonFooter) + "\n```\n";
        return { content: [{ type: "text", text }] };
      } catch (e: any) {
        ctx.logger?.error(`Search failed: ${e?.message || String(e)}`);
        return { content: [{ type: "text", text: `Search failed: ${e?.message || String(e)}` }], isError: true };
      }
    }
  );
};

