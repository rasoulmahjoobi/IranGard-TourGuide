"use client";

import type { Path, UseFormRegister } from "react-hook-form";
import { Input, Select, Textarea } from "@/src/components/ui";
import { BLOOD_TYPES } from "@/src/lib/personValidation";
import type { CheckoutValues, PersonValues } from "@/src/lib/schemas/checkout.schema";

type PersonErrors = Partial<Record<keyof PersonValues, { message?: string } | undefined>>;

interface PersonFieldsProps {
  prefix: string;
  register: UseFormRegister<CheckoutValues>;
  errors?: PersonErrors;
  lockPhone?: boolean;
}

export function PersonFields({ prefix, register, errors, lockPhone }: PersonFieldsProps) {
  const name = (field: keyof PersonValues) => `${prefix}.${field}` as Path<CheckoutValues>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="نام کامل:"
        placeholder="مثلاً علی رضایی"
        {...register(name("fullName"))}
        error={errors?.fullName?.message}
      />
      <Input
        label="شماره همراه:"
        dir="ltr"
        inputMode="numeric"
        maxLength={11}
        placeholder="09123456789"
        readOnly={lockPhone}
        {...register(name("phone"))}
        error={errors?.phone?.message}
      />
      <Input
        label="کد ملی:"
        dir="ltr"
        inputMode="numeric"
        maxLength={10}
        {...register(name("nationalId"))}
        error={errors?.nationalId?.message}
      />
      <Select label="گروه خونی:" {...register(name("bloodType"))} error={errors?.bloodType?.message}>
        <option value="">انتخاب کنید</option>
        {BLOOD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <div className="sm:col-span-2">
        <Textarea label="آدرس:" rows={2} {...register(name("address"))} error={errors?.address?.message} />
      </div>
      <div className="sm:col-span-2">
        <Textarea
          label="بیماری زمینه‌ای:"
          rows={2}
          placeholder="در صورت نداشتن، «ندارد» بنویسید"
          {...register(name("disease"))}
          error={errors?.disease?.message}
        />
      </div>
    </div>
  );
}