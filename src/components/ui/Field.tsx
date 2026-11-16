'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  /** Unit typeset inside the field on the right, e.g. "kg". */
  unit?: string;
  leading?: React.ReactNode;
  className?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

/**
 * Sentence-case 14px label above a 48px input. `inputmode`, `autocomplete`
 * and `enterkeyhint` are the caller's responsibility and should always be
 * set. Pass the input element as the child; the field wires ids and aria.
 */
export function Field({ label, help, error, unit, leading, className, children }: FieldProps) {
  const reactId = React.useId();
  const id = children.props.id ?? `f-${reactId}`;
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const input = React.cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [helpId, errId].filter(Boolean).join(' ') || undefined,
    className: cn('flex-1 min-w-0 bg-transparent outline-none text-base text-ink placeholder:text-ink-muted tnum h-full', children.props.className),
  } as React.InputHTMLAttributes<HTMLInputElement>);

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="t-ui block">{label}</label>
      <div
        className={cn(
          'flex items-center gap-2 h-12 px-3 rounded-[var(--radius-sm)] border bg-[var(--bg-input)] transition-colors duration-[var(--dur-1)] focus-within:border-line-active',
          error ? 'border-status-rejected' : 'border-[var(--border-input)]'
        )}
      >
        {leading && <span className="text-ink-muted shrink-0">{leading}</span>}
        {input}
        {unit && <span className="text-sm text-ink-muted shrink-0">{unit}</span>}
      </div>
      {help && !error && <p id={helpId} className="t-caption">{help}</p>}
      {error && <p id={errId} className="t-caption text-status-rejected">{error}</p>}
    </div>
  );
}

/** Multi-line variant. */
export function TextArea({ label, help, error, className, ...rest }: { label: React.ReactNode; help?: React.ReactNode; error?: React.ReactNode; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = rest.id ?? `ta-${React.useId()}`;
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="t-ui block">{label}</label>
      <textarea
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full min-h-[120px] p-3 rounded-[var(--radius-sm)] border bg-[var(--bg-input)] text-base text-ink placeholder:text-ink-muted outline-none resize-y transition-colors duration-[var(--dur-1)] focus:border-line-active',
          error ? 'border-status-rejected' : 'border-[var(--border-input)]'
        )}
      />
      {help && !error && <p className="t-caption">{help}</p>}
      {error && <p className="t-caption text-status-rejected">{error}</p>}
    </div>
  );
}
