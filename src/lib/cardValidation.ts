/** الگوریتم Luhn نگه داشته می‌شه برای استفاده‌ی احتمالی بعدی، ولی دیگه تو اعتبارسنجی فرم اجباری نیست */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length !== 16) return false;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** تنها شرط لازم: دقیقاً ۱۶ رقم عددی */
export function isValidCardFormat(cardNumber: string): boolean {
  return /^\d{16}$/.test(cardNumber.replace(/\D/g, ""));
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, "$1 ");
}

export function maskCard(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return `**** **** **** ${digits.slice(-4)}`;
}

export const CANCEL_FEE_RATE = 0.1;

export function computeRefund(totalPaid: number) {
  const fee = Math.round(totalPaid * CANCEL_FEE_RATE);
  return { fee, refund: totalPaid - fee };
}