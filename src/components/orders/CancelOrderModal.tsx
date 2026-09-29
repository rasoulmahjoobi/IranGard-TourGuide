"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle } from "lucide-react";
import { Modal, Input, Button } from "@/src/components/ui";
import {
  isValidCardFormat,
  formatCardNumber,
  maskCard,
  computeRefund,
} from "@/src/lib/cardValidation";
import { formatPrice } from "@/src/lib/format";

const cancelSchema = z.object({
  cardNumber: z
    .string()
    .refine((v) => isValidCardFormat(v), "شماره کارت باید دقیقاً ۱۶ رقم باشد"),
});
type CancelValues = z.infer<typeof cancelSchema>;

interface CancelOrderModalProps {
  open: boolean;
  totalPaid: number;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (maskedCard: string) => void;
}

export function CancelOrderModal({
  open,
  totalPaid,
  isSubmitting,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [displayValue, setDisplayValue] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CancelValues>({ resolver: zodResolver(cancelSchema) });

  const { fee, refund } = computeRefund(totalPaid);

  const submit = (values: CancelValues) => {
    onConfirm(maskCard(values.cardNumber));
  };

  const handleClose = () => {
    reset();
    setDisplayValue("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="لغو سفارش">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
        <div className="flex items-start gap-2 rounded-2xl bg-coral/10 p-4 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
          <div>
            با لغو سفارش، <span className="font-bold">۱۰٪ از مبلغ پرداختی</span>{" "}
            به‌عنوان کارمزد کسر می‌شود.
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
              <span>مبلغ پرداختی: {formatPrice(totalPaid)}</span>
              <span>کارمزد لغو (۱۰٪): {formatPrice(fee)}</span>
              <span className="font-bold text-foreground">
                مبلغ قابل بازگشت: {formatPrice(refund)}
              </span>
            </div>
          </div>
        </div>

        <Input
          label="شماره کارت جهت بازگشت وجه:"
          dir="ltr"
          inputMode="numeric"
          value={displayValue}
          {...register("cardNumber")}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            setDisplayValue(formatted);
            setValue("cardNumber", formatted.replace(/\s/g, ""), {
              shouldValidate: true,
            });
          }}
          placeholder="6037 9918 9997 1234"
          error={errors.cardNumber?.message}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="!bg-gradient-to-l !from-red-600 !to-red-500"
          >
            {isSubmitting ? "در حال لغو..." : "لغو سفارش و بازگشت وجه"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
