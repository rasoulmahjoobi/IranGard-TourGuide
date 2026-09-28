import type { PersonInfo } from "@/src/types/order";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** تبدیل ارقام فارسی/عربی به انگلیسی */
export function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

/** اعتبارسنجی کد ملی ایران (طول ۱۰ رقم + رقم کنترل) */
export function isValidNationalCode(input: string): boolean {
  const code = toEnDigits(input.trim());
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false; // مثل 1111111111
  const check = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((acc, digit, i) => acc + Number(digit) * (10 - i), 0);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const lastName = parts.length > 1 ? (parts.pop() as string) : "";
  return { firstName: parts.join(" "), lastName };
}

export function normalizePerson(person: PersonInfo): PersonInfo {
  return {
    fullName: person.fullName.trim(),
    phone: toEnDigits(person.phone.trim()),
    nationalId: toEnDigits(person.nationalId.trim()),
    address: person.address.trim(),
    bloodType: person.bloodType,
    disease: person.disease.trim(),
  };
}