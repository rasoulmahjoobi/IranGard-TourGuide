/** فرمت قیمت به تومان با اعداد فارسی، مثل ۲۰۰٬۰۰۰ تومان */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

/** فرمت اعداد ساده به فارسی (مثل تعداد) */
export function toFaDigits(value: number | string): string {
  return Number(value).toLocaleString("fa-IR");
}