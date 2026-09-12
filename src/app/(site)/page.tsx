import { Hero } from "@/src/components/tour/Hero";
import { CategoryChips } from "@/src/components/tour/CategoryChips";
import { TourGrid } from "@/src/components/tour/TourGrid";

const featuredTours = [
  { title: "تور طبیعت‌گردی ماسوله", location: "گیلان", duration: "۲ روز و ۱ شب", price: "۲,۹۵۰,۰۰۰", rating: 4.8, category: "طبیعت‌گردی", gradient: "from-turquoise via-secondary to-emerald-700", discount: "۱۵٪ تخفیف" },
  { title: "تور تاریخی اصفهان", location: "اصفهان", duration: "۳ روز و ۲ شب", price: "۴,۲۰۰,۰۰۰", rating: 4.9, category: "تاریخی", gradient: "from-accent via-primary to-coral" },
  { title: "تور ساحلی کیش", location: "هرمزگان", duration: "۴ روز و ۳ شب", price: "۶,۵۰۰,۰۰۰", rating: 4.7, category: "ساحلی", gradient: "from-sky-400 via-turquoise to-secondary", discount: "پرفروش" },
  { title: "تور استانبول", location: "ترکیه", duration: "۵ روز و ۴ شب", price: "۱۸,۹۰۰,۰۰۰", rating: 4.6, category: "خارجی", gradient: "from-primary via-coral to-pink-600" },
];

const popularTours = [
  { title: "تور ماجراجویی دماوند", location: "مازندران", duration: "۲ روز و ۱ شب", price: "۳,۸۰۰,۰۰۰", rating: 4.5, category: "ماجراجویی", gradient: "from-secondary via-turquoise to-slate-700" },
  { title: "تور فرهنگی شیراز", location: "فارس", duration: "۳ روز و ۲ شب", price: "۳,۹۵۰,۰۰۰", rating: 4.8, category: "تاریخی", gradient: "from-accent via-amber-600 to-primary" },
  { title: "تور جنگل ابر", location: "سمنان", duration: "۱ روز", price: "۱,۲۰۰,۰۰۰", rating: 4.4, category: "طبیعت‌گردی", gradient: "from-emerald-600 via-turquoise to-secondary" },
  { title: "تور دبی", location: "امارات", duration: "۴ روز و ۳ شب", price: "۲۲,۵۰۰,۰۰۰", rating: 4.7, category: "خارجی", gradient: "from-coral via-primary to-accent", discount: "۱۰٪ تخفیف" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14 pb-10">
      <Hero />

      <div className="mx-auto w-full max-w-6xl px-4">
        <CategoryChips />
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-primary" />
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">تورهای پیشنهادی</h2>
        </div>
        <TourGrid tours={featuredTours} />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-turquoise" />
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">محبوب‌ترین تورها</h2>
        </div>
        <TourGrid tours={popularTours} />
      </section>
    </div>
  );
}