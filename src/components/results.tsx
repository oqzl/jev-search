import { useState } from 'react';
import { formatPublicationAge } from '@/lib/freshness';
import { PERSONAL_SIGNALS } from '@/lib/personal';
import type { Cluster, RankedItem } from '@/lib/rank';
import { sourceById } from '@/lib/sources';
import { cn } from '@/lib/utils';
import { SourceIcon } from './source-icon';

function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const id = u.searchParams.get('id') ?? u.searchParams.get('v');
    const path = u.pathname.replace(/\/$/, '') + (id ? `?${u.searchParams.has('id') ? 'id' : 'v'}=${id}` : '');
    return `${u.hostname.replace(/^www\./, '')}${path.length > 48 ? `${path.slice(0, 48)}…` : path}`;
  } catch {
    return url;
  }
}

function ResultRow({
  item,
  minor,
}: {
  item: RankedItem;
  minor?: boolean;
}) {
  const age = formatPublicationAge(item);
  const strongest = PERSONAL_SIGNALS
    .map((signal) => ({ ...signal, value: item.personal[signal.id] }))
    .filter((signal) => signal.value >= 0.5)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  return (
    <article className={cn('group', minor ? 'ml-1 border-l border-border/70 pl-3' : '')}>
      <div className="flex items-center gap-1.5 text-[11px] leading-4 text-muted-foreground">
        <span className="inline-flex size-4 shrink-0 items-center justify-center" title={sourceById(item.source).label}>
          <SourceIcon className="size-3.5" id={item.source} />
        </span>
        <span className="truncate">{displayUrl(item.url)}</span>
        {age && <span className="shrink-0">· <time dateTime={item.publishedDate}>{age}</time></span>}
        {item.engines.length > 1 && (
          <span title={item.engines.join(' + ')}>· found by {item.engines.length} engines</span>
        )}
      </div>
      <a
        className={cn(
          'mt-1 block leading-snug text-link visited:text-visited hover:underline',
          minor ? 'text-[14px]' : 'text-[17px]'
        )}
        href={item.url}
        rel="noreferrer"
        target="_blank"
      >
        {item.title}
      </a>
      {!minor && item.snippet && (
        <p className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground line-clamp-2">{item.snippet}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
        {item.ranked ? (
          <>
            <span
              className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5"
              title="Overall match: topic relevance adjusted by the seven personal-interest signals"
            >
              <span
                className={cn(
                  'inline-block size-2 rounded-full',
                  item.personalScore >= 0.7 ? 'bg-emerald-500' : item.personalScore >= 0.4 ? 'bg-amber-500' : 'bg-neutral-400'
                )}
              />
              {Math.round(item.personalScore * 100)}% match
            </span>
            <span className="rounded-md bg-muted/50 px-1.5 py-0.5">{Math.round(item.relevance * 100)}% topic</span>
            {strongest.map((signal) => (
              <span className="rounded-md bg-muted/50 px-1.5 py-0.5" key={signal.id}>
                {signal.label} {Math.round(signal.value * 100)}%
              </span>
            ))}
          </>
        ) : (
          <span>Jev score unavailable</span>
        )}
      </div>
    </article>
  );
}

/** Below this the judge says "not about what you asked"; such rows are folded away, not deleted. */
export const OFF_TOPIC = 0.3;

export function Results({
  clusters,
  streaming,
}: {
  clusters: Cluster[];
  streaming: boolean;
}) {
  const [showOffTopic, setShowOffTopic] = useState(false);
  const onTopic = clusters.filter((c) => c.lead.relevance >= OFF_TOPIC);
  const offTopic = clusters.filter((c) => c.lead.relevance < OFF_TOPIC);

  if (clusters.length === 0) {
    if (streaming) return null;
    return (
      <p className="mt-8 text-muted-foreground">
        Nothing found. Try a wider time range, or more sources.
      </p>
    );
  }

  const render = (list: Cluster[]) =>
    list.map((cluster) => (
      <li className="enter flex flex-col gap-2 py-4 first:pt-3 last:pb-1" key={cluster.lead.id}>
        <ResultRow item={cluster.lead} />
        {cluster.others.map((item) => (
          <ResultRow item={item} key={item.id} minor />
        ))}
      </li>
    ));

  return (
    <>
      <ol className="mt-1 divide-y divide-border/70">{render(onTopic)}</ol>
      {offTopic.length > 0 && !streaming && (
        <div className="mt-8">
          <button
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setShowOffTopic((v) => !v)}
            type="button"
          >
            {showOffTopic ? 'Hide' : 'Show'} {offTopic.length} more that {offTopic.length === 1 ? "didn't" : "didn't"} seem to match
          </button>
          {showOffTopic && <ol className="mt-4 flex flex-col gap-6 opacity-70">{render(offTopic)}</ol>}
        </div>
      )}
    </>
  );
}

