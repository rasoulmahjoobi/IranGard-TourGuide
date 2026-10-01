export const INTERNATIONAL_CATEGORY_ID = 4;

/** مقصدهایی که علاوه‌بر پرواز، گزینه‌ی سفر زمینی/دریایی هم دارن */
const LAND_OPTION_LOCATIONS = new Set(["ترکیه", "امارات", "عمان"]);

export function hasLandOption(location: string): boolean {
  return LAND_OPTION_LOCATIONS.has(location);
}

export const TRAVEL_TYPE_MULTIPLIER = {
  land: 0.85, // ۱۵٪ ارزان‌تر
  air: 1.15, // ۱۵٪ گران‌تر
} as const;

export const TRAVEL_TYPE_LABEL = {
  land: "سفر زمینی/دریایی",
  air: "سفر هوایی",
} as const;