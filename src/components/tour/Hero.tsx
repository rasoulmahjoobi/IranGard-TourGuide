"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { MapPin, Search, Calendar } from "lucide-react";
import { PersianDatePicker } from "@/src/components/ui";

export function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<DateObject | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("q", destination.trim());
    if (date) {
      // تبدیل تاریخ شمسی انتخاب‌شده به میلادی ISO، چون دیتای بک‌اند میلادیه
      const gregorianDate = date.convert(gregorian, gregorian_en);
      params.set("date", gregorianDate.format("YYYY-MM-DD"));
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-secondary px-4 py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 animate-blob rounded-full bg-primary/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 animate-blob rounded-full bg-turquoise/40 blur-3xl [animation-delay:2s]" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-40 w-40 animate-float rounded-full bg-accent/30 blur-2xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="animate-fade-up rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
          ✈️ بیش از ۲۰۰ تور در سراسر ایران و جهان
        </span>
        <h1 className="animate-fade-up text-3xl font-extrabold leading-tight [animation-delay:100ms] sm:text-5xl">
          سفری به یاد ماندنی با <span className="text-accent">ایران گرد تور</span>
        </h1>
        <p className="animate-fade-up max-w-xl text-sm text-white/80 [animation-delay:200ms] sm:text-base">
          بهترین تورهای طبیعت‌گردی، تاریخی و خارجی را با قیمت مناسب و همراهی حرفه‌ای تجربه کنید.
        </p>

        <form
          onSubmit={handleSearch}
          className="animate-fade-up flex w-full max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl [animation-delay:300ms] sm:flex-row sm:rounded-full"
        >
          <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="مقصد مورد نظر..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="hidden flex-1 items-center gap-2 border-r border-border px-4 py-2.5 sm:flex">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            <PersianDatePicker value={date} onChange={setDate} placeholder="تاریخ سفر" />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-primary to-coral px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.02]"
          >
            <Search className="h-4 w-4" />
            جستجوی تور
          </button>
        </form>
      </div>
    </section>
  );
}