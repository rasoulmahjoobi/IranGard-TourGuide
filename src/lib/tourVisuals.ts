// گرادیان اختصاصی هر دسته‌بندی — وقتی عکس واقعی نیست، این جایگزینش می‌شه
const gradients: Record<number, string> = {
  1: "from-turquoise via-secondary to-emerald-700", // طبیعت‌گردی
  2: "from-accent via-primary to-coral",             // تاریخی و فرهنگی
  3: "from-sky-400 via-turquoise to-secondary",      // ساحلی
  4: "from-primary via-coral to-pink-600",           // تورهای خارجی
};

export function getCategoryGradient(categoryId: number): string {
  return gradients[categoryId] ?? "from-gray-400 via-gray-500 to-gray-600";
}