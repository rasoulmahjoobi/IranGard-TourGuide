"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useTours } from "@/src/hooks/useTours";
import { useUpdateTour } from "@/src/hooks/useTourMutations";
import { useAutoCorrectPage } from "@/src/hooks/useAutoCorrectPage";
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

  const [edits, setEdits] = useState<Record<number, RowEdit>>({});
  // کدهای «فعال»ی که الان به‌صورت textbox نمایش داده می‌شن — کلید: `${tourId}-${field}`
  const [activeCells, setActiveCells] = useState<Set<string>>(new Set());
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
  useAutoCorrectPage(page, totalPages, isLoading, (p) => updateParams({ page: String(p) }));

  const hasChanges = Object.keys(edits).length > 0;
  const cellKey = (id: number, field: "price" | "quantity") => `${id}-${field}`;

  const displayValue = (tour: Tour, field: "price" | "quantity") => edits[tour.id]?.[field] ?? tour[field];

  const handleActivate = (id: number, field: "price" | "quantity") => {
    setActiveCells((prev) => new Set(prev).add(cellKey(id, field)));
  };

  const handleChange = (id: number, field: "price" | "quantity", value: number) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  // Esc → هم از حالت فعال، هم از آرایه‌ی تغییرات خارج می‌شه (انصراف کامل از همون فیلد)
  const handleCancelField = (id: number, field: "price" | "quantity") => {
    setActiveCells((prev) => {
      const next = new Set(prev);
      next.delete(cellKey(id, field));
      return next;
    });
    setEdits((prev) => {
      const rest = { ...prev };
      const row = { ...rest[id] };
      delete row[field];
      if (Object.keys(row).length === 0) delete rest[id];
      else rest[id] = row;
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
      // طبق درخواستت، همه‌ی ردیف‌های تغییریافته با هم (Promise.all) ذخیره می‌شن
      await Promise.all(
        Object.entries(edits).map(([id, patch]) => updateMutation.mutateAsync({ id: Number(id), patch }))
      );
      toast.success("تغییرات موجودی و قیمت با موفقیت ذخیره شد");
      setEdits({});
      setActiveCells(new Set()); // فقط الان، بعد از موفقیت، همه‌ی سلول‌ها از حالت اینپوت خارج می‌شن
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
        <h1 className="text-xl font-extrabold text-foreground">مدیریت موجودی و قیمت‌ها</h1>
        <Button onClick={handleSaveClick} disabled={!hasChanges || isSaving} className="w-fit">
          {isSaving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        روی عدد قیمت یا ظرفیت کلیک کن تا قابل ویرایش بشه. تا وقتی «ذخیره» رو نزنی، همون‌طور اینپوت می‌مونه. Esc = انصراف از همون فیلد.
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
                      isActive={activeCells.has(cellKey(tour.id, "price"))}
                      onActivate={() => handleActivate(tour.id, "price")}
                      onChange={(v) => handleChange(tour.id, "price", v)}
                      onCancel={() => handleCancelField(tour.id, "price")}
                      formatDisplay={formatPrice}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <EditableCell
                      value={displayValue(tour, "quantity")}
                      isActive={activeCells.has(cellKey(tour.id, "quantity"))}
                      onActivate={() => handleActivate(tour.id, "quantity")}
                      onChange={(v) => handleChange(tour.id, "quantity", v)}
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