import { z } from "zod";
import { BLOOD_TYPES, isValidNationalCode, toEnDigits } from "@/src/lib/personValidation";

export const personSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام کامل را وارد کنید")
    .regex(/^[\u0600-\u06FF\u200cA-Za-z\s]+$/, "نام فقط باید شامل حروف باشد")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "نام و نام خانوادگی را کامل وارد کنید"),
  phone: z.string().regex(/^(09|۰۹)[0-9۰-۹]{9}$/, "شماره همراه معتبر نیست (مثلاً 09123456789)"),
  nationalId: z
    .string()
    .min(1, "کد ملی الزامی است")
    .refine((v) => isValidNationalCode(v), "کد ملی معتبر نیست"),
  address: z.string().trim().min(10, "آدرس کامل را وارد کنید (حداقل ۱۰ کاراکتر)"),
  bloodType: z
    .string()
    .refine((v) => (BLOOD_TYPES as readonly string[]).includes(v), "گروه خونی را انتخاب کنید"),
  disease: z
    .string()
    .trim()
    .min(2, "بیماری زمینه‌ای را وارد کنید (در صورت نداشتن، «ندارد» بنویسید)"),
});

export type PersonValues = z.infer<typeof personSchema>;

export const checkoutSchema = z
  .object({
    leader: personSchema,
    tours: z.array(
      z.object({
        origin: z.enum(["tehran", "destination"]),
        companions: z.array(personSchema),
      })
    ),
  })
  .superRefine((data, ctx) => {
    // کد ملی نباید بین سرگروه و همراهان یک تور تکراری باشد
    data.tours.forEach((tour, i) => {
      const seen = new Set<string>();
      const leaderId = toEnDigits(data.leader.nationalId.trim());
      if (leaderId) seen.add(leaderId);
      tour.companions.forEach((companion, j) => {
        const id = toEnDigits(companion.nationalId.trim());
        if (!id) return;
        if (seen.has(id)) {
          ctx.addIssue({
            code: "custom",
            message: "این کد ملی تکراری است",
            path: ["tours", i, "companions", j, "nationalId"],
          });
        }
        seen.add(id);
      });
    });
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;