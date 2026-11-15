/**
 * Build a wa.me link for a phone number stored in any human format
 * ("+234 801 234 5678", "0801..."). Returns undefined when there is no
 * usable number so callers can hide or disable the control.
 */
export function whatsappLink(phone: string | null | undefined, message?: string): string | undefined {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length < 8) return undefined;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
