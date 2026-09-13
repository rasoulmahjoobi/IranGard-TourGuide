"use client";

import DatePicker, { type DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { cn } from "@/src/lib/utils";

interface PersianDatePickerProps {
  value: DateObject | null;
  onChange: (date: DateObject | null) => void;
  placeholder?: string;
  className?: string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className,
}: PersianDatePickerProps) {
  return (
    <DatePicker
      value={value}
      onChange={(date) => onChange(date as DateObject | null)}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      inputClass={cn(
        "w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
        className
      )}
      placeholder={placeholder}
      containerStyle={{ width: "100%" }}
    />
  );
}