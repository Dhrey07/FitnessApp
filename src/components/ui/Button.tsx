import * as React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

const base =
  'focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition-[background-color,color,opacity,transform] duration-[var(--dur-1)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-strong text-brand-on-strong hover:bg-[var(--brand-strong-hover)]',
  secondary: 'bg-transparent text-ink border border-[var(--border-input)] hover:border-line-active hover:bg-[var(--bg-card-hover)]',
  ghost: 'bg-transparent text-ink-secondary hover:text-ink hover:bg-[var(--bg-card-hover)]',
  destructive: 'bg-status-rejected text-[var(--bg-primary)] hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };
type LinkProps = CommonProps & { href: string; target?: string; rel?: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> };

export type AnyButtonProps = ButtonProps | LinkProps;

/**
 * The only button. Heights 40/48/56, pill shape, loading keeps width.
 * Pass `href` to render a Next link with the same look.
 */
export function Button(props: AnyButtonProps) {
  const { variant = 'primary', size = 'md', loading, full, leading, trailing, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], full && 'w-full', className);
  const content = (
    <>
      {loading ? <Loader2 size={16} className="animate-spin absolute left-1/2 -translate-x-1/2" aria-hidden /> : leading}
      <span className={cn(loading && 'invisible')}>{children}</span>
      {loading && <span aria-live="polite" className="sr-only">Loading</span>}
      {!loading && trailing}
    </>
  );

  if ('href' in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={cn(classes, 'relative')}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, loading: _l, full: _f, leading: _le, trailing: _t, className: _c, children: _ch, href: _h, ...rest } = props as ButtonProps;
  return (
    <button type="button" {...rest} disabled={rest.disabled || loading} aria-busy={loading || undefined} className={cn(classes, 'relative')}>
      {content}
    </button>
  );
}

/** Square icon-only button, 44px target. */
export function IconButton({ label, className, size = 'md', variant = 'ghost', children, ...rest }: { label: string } & Omit<ButtonProps, 'leading' | 'trailing' | 'full'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(base, variants[variant], size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11', 'px-0', className)}
    >
      {children}
    </button>
  );
}
