import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function Wordmark({ size }: { size: 'sm' | 'lg' }) {
  return (
    <Link
      className={cn(
        'vt-wordmark inline-flex shrink-0 items-center tracking-[-0.025em] select-none',
        size === 'lg' ? 'gap-3 text-4xl' : 'gap-1.5 text-[15px]'
      )}
      to="/"
      viewTransition
    >
      <Logo className={size === 'lg' ? 'size-10' : 'size-5'} />
      <span className="whitespace-nowrap leading-tight">
        Jev<span className="text-primary-text"> Search</span>
      </span>
    </Link>
  );
}
