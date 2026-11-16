import fs from 'node:fs';
import path from 'node:path';

/**
 * Server-only: uses node:fs. Import from server components and route handlers only.
 * Photo slots. Each slot resolves to a real photograph when one exists in
 * public/photos (any of the extensions below) and otherwise to the
 * art-directed placeholder that ships with the repo. Drop `hero-desktop.jpg`
 * into public/photos and the site picks it up with no code change.
 */
export type PhotoSlot =
  | 'hero-mobile'
  | 'hero-desktop'
  | 'coach'
  | 'plate'
  | 'movement'
  | 'result-1-before'
  | 'result-1-after'
  | 'result-2-before'
  | 'result-2-after'
  | 'result-3-before'
  | 'result-3-after'
  | 'login'
  | 'onboarding';

export const PHOTO_SIZES: Record<PhotoSlot, { width: number; height: number }> = {
  'hero-mobile': { width: 1200, height: 1500 },
  'hero-desktop': { width: 1920, height: 1080 },
  coach: { width: 1200, height: 1500 },
  plate: { width: 1200, height: 1200 },
  movement: { width: 1920, height: 1080 },
  'result-1-before': { width: 1200, height: 1500 },
  'result-1-after': { width: 1200, height: 1500 },
  'result-2-before': { width: 1200, height: 1500 },
  'result-2-after': { width: 1200, height: 1500 },
  'result-3-before': { width: 1200, height: 1500 },
  'result-3-after': { width: 1200, height: 1500 },
  login: { width: 1200, height: 1500 },
  onboarding: { width: 1920, height: 1080 },
};

const REAL_EXTENSIONS = ['jpg', 'jpeg', 'webp', 'avif', 'png'];
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'photos');

export interface ResolvedPhoto {
  src: string;
  width: number;
  height: number;
  /** True when the art-directed placeholder is being served. */
  placeholder: boolean;
}

export function resolvePhoto(slot: PhotoSlot): ResolvedPhoto {
  const size = PHOTO_SIZES[slot];
  for (const ext of REAL_EXTENSIONS) {
    if (fs.existsSync(path.join(PUBLIC_DIR, `${slot}.${ext}`))) {
      return { src: `/photos/${slot}.${ext}`, ...size, placeholder: false };
    }
  }
  return { src: `/photos/${slot}.placeholder.svg`, ...size, placeholder: true };
}
