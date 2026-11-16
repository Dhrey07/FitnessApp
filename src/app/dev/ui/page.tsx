import { notFound } from 'next/navigation';
import { UiDemo } from './UiDemo';

export const dynamic = 'force-static';

/** Local-only gallery of every component in src/components/ui. */
export default function UiDemoPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SHOW_DEV_PAGES !== 'true') notFound();
  return <UiDemo />;
}
