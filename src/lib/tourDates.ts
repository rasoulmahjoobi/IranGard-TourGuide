function faToEnDigits(str: string): string {
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)));
}

export function extractDurationDays(duration: string): number {
  const normalized = faToEnDigits(duration);
  const match = normalized.match(/(\d+)/);
  return match ? Math.max(1, parseInt(match[1], 10)) : 1;
}

/** تاریخ رو بدون دخالت timezone محلی پارس می‌کنه — دقیقاً همون باگی که باعث تداخل کاذب می‌شد */
function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function computeTourEndDate(departureDate: string, duration: string): string {
  const days = extractDurationDays(duration);
  const start = parseDateOnly(departureDate);
  start.setUTCDate(start.getUTCDate() + days);
  return start.toISOString().slice(0, 10);
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return parseDateOnly(startA) <= parseDateOnly(endB) && parseDateOnly(startB) <= parseDateOnly(endA);
}