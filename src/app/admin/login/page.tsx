"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "@/src/components/ui";
import { Logo } from "@/src/components/icons/Logo";
import { loginSchema, type LoginValues } from "@/src/lib/schemas/auth.schema";
import { useLogin } from "@/src/hooks/useLogin";
import { ROUTES, SITE_NAME } from "@/src/lib/constants";

export default function AdminLoginPage() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-secondary px-4">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="h-14 w-14" />
          <h1 className="text-base font-bold text-foreground">ورود به پنل مدیریت {SITE_NAME}</h1>
        </div>
        <Input label="نام کاربری:" {...register("username")} error={errors.username?.message} />
        <Input label="رمز عبور:" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" loading={isPending}>
          ورود
        </Button>
        <Link href={ROUTES.home} className="text-center text-sm text-primary hover:underline">
          بازگشت به سایت
        </Link>
      </form>
    </div>
  );
}