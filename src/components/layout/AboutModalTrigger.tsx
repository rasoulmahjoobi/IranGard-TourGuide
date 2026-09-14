"use client";

import { useState } from "react";
import { Modal } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

export function AboutModalTrigger({ label, className }: { label: string; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("cursor-pointer text-right", className)}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="درباره‌ی ایران گرد تور">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            ایران گرد تور از سال ۱۳۹۸ فعالیت خود را در زمینه‌ی برگزاری تورهای طبیعت‌گردی، تاریخی و
            خارجی آغاز کرده و تاکنون بیش از ۲۰۰ تور موفق برای مسافران خود برگزار کرده است.
          </p>
          <p>
            هدف ما ارائه‌ی سفرهایی امن، مقرون‌به‌صرفه و به‌یادماندنی با راهنماهای مجرب و پشتیبانی
            ۲۴ ساعته است.
          </p>
        </div>
      </Modal>
    </>
  );
}