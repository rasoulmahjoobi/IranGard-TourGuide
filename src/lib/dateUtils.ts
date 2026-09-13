import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

/** تبدیل تاریخ میلادی ISO (که از بک‌اند میاد) به نمایش شمسی، مثل ۱۴۰۵/۰۷/۱۳ */
export function toPersianDate(isoDate: string): string {
  const date = new DateObject({ date: isoDate, format: "YYYY-MM-DD" });
  return date.convert(persian, persian_fa).format("YYYY/MM/DD");
}