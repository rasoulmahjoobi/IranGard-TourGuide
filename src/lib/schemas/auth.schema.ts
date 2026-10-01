import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "نام کامل را وارد کنید")
      .regex(/^[\u0600-\u06FF\u200cA-Za-z\s]+$/, "نام فقط باید شامل حروف باشد")
      .refine((v) => v.trim().split(/\s+/).length >= 2, "نام و نام خانوادگی را کامل وارد کنید"),
    phone: z.string().regex(/^(09|۰۹)[0-9۰-۹]{9}$/, "شماره همراه معتبر نیست (مثلاً 09123456789)"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof signupSchema>;
