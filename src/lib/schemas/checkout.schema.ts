import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "نام الزامی است"),
  lastName: z.string().min(2, "نام خانوادگی الزامی است"),
  address: z.string().min(10, "آدرس کامل را وارد کنید"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره تلفن همراه معتبر نیست (مثلاً 09123456789)"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;