import * as React from 'react';
import { cn } from '@/lib/cn';
import { ListRow, ListRows } from './ListRow';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

/**
 * Desktop table. Below 768px the same rows render as ListRows using
 * `mobile`, which picks the title, subtitle and trailing node per row.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  mobile,
  empty,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  mobile: (row: T) => { title: React.ReactNode; subtitle?: React.ReactNode; trailing?: React.ReactNode; leading?: React.ReactNode; href?: string };
  empty?: React.ReactNode;
  className?: string;
}) {
  if (rows.length === 0 && empty) return <>{empty}</>;
  return (
    <div className={className}>
      <div className="md:hidden">
        <ListRows>
          {rows.map((r) => {
            const m = mobile(r);
            return <ListRow key={rowKey(r)} {...m} />;
          })}
        </ListRows>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="hairline-b">
              {columns.map((c) => (
                <th key={c.key} scope="col" style={{ width: c.width }} className={cn('t-caption font-medium py-2.5 pr-4 last:pr-0', c.align === 'right' ? 'text-right' : 'text-left')}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {rows.map((r) => (
              <tr key={rowKey(r)} className="hover:bg-[var(--bg-card-hover)] transition-colors duration-[var(--dur-1)]">
                {columns.map((c) => (
                  <td key={c.key} className={cn('py-3 pr-4 last:pr-0 align-middle tnum', c.align === 'right' && 'text-right')}>
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
