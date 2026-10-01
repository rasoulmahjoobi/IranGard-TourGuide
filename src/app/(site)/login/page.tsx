"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, PasswordInput } from "@/src/components/ui";
import { Logo } from "@/src/components/icons/Logo";
import { loginSchema, type LoginValues } from "@/src/lib/schemas/auth.schema";
import { useLogin } from "@/src/hooks/useLogin";
import { ROUTES, SITE_NAME } from "@/src/lib/constants";

export default function LoginPage() {
  const { mutate, isPending } = useLogin({ expectedRole: "customer" });
  const [nextQuery, setNextQuery] = useState("");
  useEffect(() => {
    setNextQuery(window.location.search);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 px-4 py-16">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-full flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="h-14 w-14" />
          <h1 className="text-base font-bold text-foreground">ورود به {SITE_NAME}</h1>
          <p className="text-xs text-muted-foreground">با شماره همراه و رمز عبور وارد شوید</p>
        </div>
        <Input
          label="شماره همراه:"
          dir="ltr"
          inputMode="numeric"
          placeholder="09123456789"
          {...register("username")}
          error={errors.username?.message}
        />
        <PasswordInput label="رمز عبور:" {...register("password")} error={errors.password?.message} />
        <Button type="submit" loading={isPending}>
          ورود
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link href={`${ROUTES.register}${nextQuery}`} className="font-semibold text-primary hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </form>
    </div>
  );
}
