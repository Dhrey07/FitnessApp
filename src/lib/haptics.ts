/** Short haptic tick on devices that support it. Silent elsewhere. */
export function haptic(ms = 10) {
  if (typeof navigator === 'undefined') return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}
