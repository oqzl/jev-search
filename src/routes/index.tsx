import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { EngineStrip, type EnginePreview } from '@/components/home-demos';
import { SearchBox } from '@/components/search-box';
import { HOME_CANONICAL } from '@/lib/seo';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ property: 'og:url', content: HOME_CANONICAL }],
    links: [{ rel: 'canonical', href: HOME_CANONICAL }],
  }),
  component: Home,
});

interface Example extends EnginePreview {
  q: string;
}

/**
 * Three requests that look nothing alike: a phrase with a source and a time,
 * a full question with only a source, and a bare topic with neither. Together
 * they say "write it any way you like" better than a template would. The
 * sources and windows are what Jev typically chooses for them, shown on hover
 * so the engine strip below can demonstrate the choice without an API call.
 */
const EXAMPLES: Example[] = [
  { q: 'Rust async runtimes on Hacker News this month', window: '30d', sources: ['hackernews', 'google'] },
  { q: 'What do Reddit users think of the Framework laptop?', window: 'any', sources: ['reddit', 'google'] },
  { q: 'New papers on speculative decoding', window: '30d', sources: ['arxiv', 'google'] },
];

/* design-structure: search-engine home · centered column, headline as the only voice, form as the CTA · footer=Ft2 */

function Home() {
  const [preview, setPreview] = useState<EnginePreview | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pb-16 pt-24 sm:pb-24 sm:pt-28">
      <h1 className="vt-wordmark display text-[clamp(2.35rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.045em]">
        Jev <span className="text-primary-text">Search</span>
      </h1>
      <p className="mt-3 text-[14px] text-muted-foreground sm:text-[15px]">
        Picks where to search. Ranks what comes back.
      </p>
      <div className="mt-8 w-full sm:mt-10">
        <SearchBox autoFocus />
      </div>
      <ul aria-label="Example searches" className="mt-4 w-full border-y text-[13px] sm:text-sm">
        {EXAMPLES.map((example) => (
          <li key={example.q}>
            <Link
              className="block min-h-10 border-b border-border/60 px-1 py-2.5 text-muted-foreground transition-colors last:border-b-0 hover:bg-accent/40 hover:text-foreground sm:min-h-9 sm:py-2"
              onBlur={() => setPreview(null)}
              onFocus={() => setPreview(example)}
              onMouseEnter={() => setPreview(example)}
              onMouseLeave={() => setPreview(null)}
              search={{ q: example.q }}
              to="/search"
              viewTransition
            >
              {example.q}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 self-start sm:mt-9">
        <EngineStrip preview={preview} />
      </div>
    </main>
  );
}
