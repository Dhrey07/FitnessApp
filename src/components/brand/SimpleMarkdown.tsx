import React from 'react';

/** Minimal Markdown: paragraphs, **bold**, "- " bullet lists and "## " headings. Enough for coach-written guidelines. */
function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

export function SimpleMarkdown({ source, className = '' }: { source: string; className?: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className={`space-y-4 text-sm sm:text-base text-ink-secondary leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5">
              {lines.map((l, j) => <li key={j}>{inline(l.trim().slice(2))}</li>)}
            </ul>
          );
        }
        if (block.startsWith('## ')) return <h3 key={i} className="font-display font-bold text-ink text-lg pt-2">{inline(block.slice(3))}</h3>;
        return <p key={i}>{inline(block.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
}
