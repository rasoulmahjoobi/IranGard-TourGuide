function faToEnDigits(str: string): string {
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)));
}

/** از رشته‌ی مدت تور (مثل «۲ روز و ۱ شب») تعداد روز رو استخراج می‌کنه */
export function extractDurationDays(duration: string): number {
  const normalized = faToEnDigits(duration);
  const match = normalized.match(/(\d+)/);
  return match ? Math.max(1, parseInt(match[1], 10)) : 1;
}

/** تاریخ پایان تخمینی تور = تاریخ حرکت + تعداد روز */
export function computeTourEndDate(departureDate: string, duration: string): string {
  const days = extractDurationDays(duration);
  const start = new Date(departureDate);
  start.setDate(start.getDate() + days);
  return start.toISOString().slice(0, 10);
}

/** آیا دو بازه‌ی تاریخ با هم تداخل دارن؟ */
export function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return new Date(startA) <= new Date(endB) && new Date(startB) <= new Date(endA);
}