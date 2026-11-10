import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

// Everyone is welcome, including AI search and assistant crawlers: the goal is to be found and cited.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'Google-Extended', 'GoogleOther', 'PerplexityBot', 'Perplexity-User',
  'Applebot', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'MistralAI-User', 'meta-externalagent', 'CCBot',
];

export const GET: APIRoute = () =>
  new Response(
    [
      '# famousinstem.com: all crawlers welcome.',
      'User-agent: *',
      'Allow: /',
      '',
      ...AI_AGENTS.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
      `Sitemap: ${SITE.url}/sitemap.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
