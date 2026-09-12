import { SITE_NAME } from "@/src/lib/constants";
import { Logo } from "@/src/components/icons/Logo";
import {  Send, Phone } from "lucide-react";

const columns = [
  { title: "مقصدها", links: ["کیش", "شمال ایران", "اصفهان", "استانبول", "دبی"] },
  { title: "شرکت", links: ["درباره ما", "همکاری با ما", "قوانین و مقررات", "سوالات متداول"] },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <span className="text-xl font-extrabold">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-secondary-foreground/70">
            همراه شما برای کشف بهترین مقصدهای ایران و جهان.
          </p>
          <div className="flex gap-3">
            {[ Send, Phone].map((Icon, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-accent">{col.title}</h4>
            {col.links.map((link) => (
              <span key={link} className="text-sm text-secondary-foreground/70 transition hover:text-white">
                {link}
              </span>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-accent">تماس با ما</h4>
          <span className="text-sm text-secondary-foreground/70">تهران، خیابان ولیعصر</span>
          <span className="text-sm text-secondary-foreground/70" dir="ltr">021-91234567</span>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} {SITE_NAME} — تمام حقوق محفوظ است
      </div>
    </footer>
  );
}