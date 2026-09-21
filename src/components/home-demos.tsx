import { SOURCES, sourceById, windowById, type SourceId, type WindowId } from '@/lib/sources';
import { SourceIcon } from './source-icon';

/** What Jev would choose for a request: the strip lights those engines. */
export interface EnginePreview {
  window: WindowId;
  sources: SourceId[];
}

/**
 * The engines as a quiet labelled row; no count, the list changes. With a
 * preview (an example being hovered) the chosen engines stay coloured, the
 * rest go grey, and the label becomes the time window: the results page's
 * filter row in miniature. Phones have no hover, so they only get the row.
 */
export function EngineStrip({ preview }: { preview?: EnginePreview | null }) {
  const chosen = preview ? new Set(preview.sources) : null;
  const windowLabel = preview ? windowById(preview.window).label : null;
  const caption = preview
    ? `Jev would look in ${preview.sources.map((id) => sourceById(id).label).join(' and ')}, ${windowLabel!.toLowerCase()}.`
    : '';

  return (
    <div className="flex flex-col items-start gap-1.5 rounded-lg border bg-card/50 px-3 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <p className="text-[11px] text-muted-foreground sm:w-20">
          {windowLabel ? `${windowLabel} ·` : 'Search via'}
        </p>
        <ul
          aria-label="Search engines"
          className="grid grid-cols-6 gap-x-4 gap-y-2 sm:flex sm:items-center sm:gap-x-2.5"
        >
          {SOURCES.map((s) => (
            <li className="inline-flex items-center" key={s.id} title={s.label}>
              <SourceIcon className="size-4 transition-opacity duration-200" id={s.id} on={!chosen || chosen.has(s.id)} />
            </li>
          ))}
        </ul>
        <span aria-hidden className="hidden sm:block sm:w-2" />
      </div>
      <p aria-live="polite" className="hidden min-h-[16px] text-[11px] text-primary-text sm:block">
        {caption}
      </p>
    </div>
  );
}
