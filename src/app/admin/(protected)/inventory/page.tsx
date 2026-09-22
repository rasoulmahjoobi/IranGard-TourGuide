"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useTours } from "@/src/hooks/useTours";
import { useUpdateTour } from "@/src/hooks/useTourMutations";
import { Button, Pagination, ConfirmDialog } from "@/src/components/ui";
import { EditableCell } from "@/src/components/admin/EditableCell";
import { formatPrice } from "@/src/lib/format";
import type { Tour } from "@/src/types/tour";

const PAGE_SIZE = 5;

interface RowEdit {
  price?: number;
  quantity?: number;
}

export default function AdminInventoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useTours({ _page: page, _limit: PAGE_SIZE });
  const updateMutation = useUpdateTour();

  // فقط کد تورهایی که واقعاً تغییر دادیم اینجا نگه‌داری می‌شه — دقیقاً همون «آرایه‌ی کدهای تغییریافته»
  const [edits, setEdits] = useState<Record<number, RowEdit>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const buildPageHref = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;
  const hasChanges = Object.keys(edits).length > 0;

  const displayValue = (tour: Tour, field: "price" | "quantity") =>
    edits[tour.id]?.[field] ?? tour[field];

  // با commit یه فیلد، کد تور به آرایه‌ی تغییرات اضافه می‌شه
  const handleCommit = (tourId: number, field: "price" | "quantity", value: number) => {
    setEdits((prev) => ({ ...prev, [tourId]: { ...prev[tourId], [field]: value } }));
  };

  // با Esc، فقط همون یه فیلد لغو می‌شه — اگه فیلد دیگه‌ای از همون ردیف هنوز تغییر داشت، ردیف کامل از آرایه حذف نمی‌شه
  const handleCancelField = (tourId: number, field: "price" | "quantity") => {
    setEdits((prev) => {
      const rest = { ...prev };
      const row = { ...rest[tourId] };
      delete row[field];
      if (Object.keys(row).length === 0) {
        delete rest[tourId];
      } else {
        rest[tourId] = row;
      }
      return rest;
    });
  };

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setConfirmOpen(true);
  };

  const confirmSave = async () => {
    setConfirmOpen(false);
    setIsSaving(true);
    try {
      // طبق مشخصات پروژه، ذخیره‌ی ردیف‌های تغییریافته به‌صورت سری (یکی‌یکی) انجام می‌شه، نه هم‌زمان
      for (const [id, patch] of Object.entries(edits)) {
        await updateMutation.mutateAsync({ id: Number(id), patch });
      }
      toast.success("تغییرات ظرفیت و قیمت با موفقیت ذخیره شد");
      setEdits({});
    } catch {
      toast.error("خطا در ذخیره‌ی تغییرات، دوباره تلاش کنید");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelSave = () => setConfirmOpen(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-foreground">مدیریت ظرفیت و قیمت‌ها</h1>
        <Button onClick={handleSaveClick} disabled={!hasChanges || isSaving} className="w-fit">
          {isSaving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        روی عدد قیمت یا ظرفیت کلیک کن تا قابل ویرایش بشه. Enter برای ثبت، Esc برای انصراف از همون فیلد.
      </p>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">تور</th>
              <th className="px-4 py-3 text-right">قیمت</th>
              <th className="px-4 py-3 text-right">ظرفیت</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {data?.tours.map((tour) => {
              const isDirty = tour.id in edits;
              return (
                <tr key={tour.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {tour.name}
                    {isDirty && (
                      <span className="mr-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        تغییر یافته
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell
                      value={displayValue(tour, "price")}
                      onCommit={(v) => handleCommit(tour.id, "price", v)}
                      onCancel={() => handleCancelField(tour.id, "price")}
                      formatDisplay={formatPrice}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell
                      value={displayValue(tour, "quantity")}
                      onCommit={(v) => handleCommit(tour.id, "quantity", v)}
                      onCancel={() => handleCancelField(tour.id, "quantity")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} buildHref={buildPageHref} />

      <ConfirmDialog
        open={confirmOpen}
        title="ذخیره‌ی تغییرات"
        description={`آیا از ذخیره‌ی تغییرات قیمت/ظرفیت برای ${Object.keys(edits).length} تور مطمئن هستید؟`}
        confirmLabel="ذخیره شود"
        onConfirm={confirmSave}
        onCancel={cancelSave}
      />
    </div>
  );
}