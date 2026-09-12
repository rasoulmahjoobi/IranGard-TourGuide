"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/src/hooks/useLogin";
import { loginSchema, LoginValues } from "@/src/lib/schemas/auth.schema";
import { Button, Input } from "@/src/components/ui";

export default function AdminLoginPage() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex w-80 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
      >
        <h1 className="text-center text-lg font-bold text-blue-600">ورود به پنل مدیریت</h1>
        <Input label="نام کاربری:" {...register("username")} error={errors.username?.message} />
        <Input label="رمز عبور:" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" loading={isPending}>ورود</Button>
      </form>
    </div>
  );
}