"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Modal } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

const contactInfo = [
  { icon: MapPin, text: "تهران، خیابان ولیعصر، پلاک ۱۲۰" },
  { icon: Phone, text: "021-91234567", dir: "ltr" as const },
  { icon: Mail, text: "info@irangardtour.ir", dir: "ltr" as const },
  { icon: Clock, text: "شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر" },
];

export function ContactModalTrigger({ label, className }: { label: string; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("cursor-pointer text-right", className)}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="تماس با ما">
        <div className="flex flex-col gap-4 text-sm text-foreground">
          {contactInfo.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <span dir={item.dir}>{item.text}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}