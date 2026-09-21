import { Heart } from 'lucide-react';

export function SponsorLink() {
  return (
    <a
      aria-label="Sponsor Jev Search (opens in a new tab)"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
      href="https://profile.stripe.com/@s1_dev"
      rel="noreferrer"
      target="_blank"
      title="Sponsor Jev Search"
    >
      <Heart aria-hidden className="size-4.5" fill="currentColor" />
    </a>
  );
}
