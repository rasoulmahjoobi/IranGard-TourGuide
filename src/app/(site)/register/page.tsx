"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, PasswordInput } from "@/src/components/ui";
import { Logo } from "@/src/components/icons/Logo";
import { signupSchema, type SignupValues } from "@/src/lib/schemas/auth.schema";
import { useSignup } from "@/src/hooks/useSignup";
import { ROUTES, SITE_NAME } from "@/src/lib/constants";

export default function RegisterPage() {
  const { mutate, isPending } = useSignup();
  const [nextQuery, setNextQuery] = useState("");
  useEffect(() => {
    setNextQuery(window.location.search);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 px-4 py-16">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-full flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="h-14 w-14" />
          <h1 className="text-base font-bold text-foreground">ثبت‌نام در {SITE_NAME}</h1>
          <p className="text-xs text-muted-foreground">شماره همراه شما به‌عنوان حساب کاربری ذخیره می‌شود</p>
        </div>
        <Input
          label="نام و نام خانوادگی:"
          placeholder="مثلاً علی رضایی"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="شماره همراه:"
          dir="ltr"
          inputMode="numeric"
          maxLength={11}
          placeholder="09123456789"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <PasswordInput label="رمز عبور:" {...register("password")} error={errors.password?.message} />
        <PasswordInput
          label="تکرار رمز عبور:"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" loading={isPending}>
          ساخت حساب کاربری
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href={`${ROUTES.login}${nextQuery}`} className="font-semibold text-primary hover:underline">
            وارد شوید
          </Link>
        </p>
      </form>
    </div>
  );
}
