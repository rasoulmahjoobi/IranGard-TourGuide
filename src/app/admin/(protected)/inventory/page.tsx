"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useTours } from "@/src/hooks/useTours";
import { useUpdateTour } from "@/src/hooks/useTourMutations";
import { Button, Pagination, ConfirmDialog } from "@/src/components/ui";
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

  // فقط فیلدهایی که کاربر واقعاً تغییر داده اینجا نگه‌داری می‌شن،
  // نه اینکه مستقیم رو دیتای اصلی اعمال بشن — تا وقتی «ذخیره» زده نشه، هیچ‌جا تغییری اعمال نمی‌شه
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
    [searchParams, pathname, router],
  );

  const buildPageHref = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;
  const hasChanges = Object.keys(edits).length > 0;

  const displayValue = (tour: Tour, field: "price" | "quantity") =>
    edits[tour.id]?.[field] ?? tour[field];

  const handleFieldChange = (
    tourId: number,
    field: "price" | "quantity",
    value: string,
  ) => {
    const num = Number(value);
    setEdits((prev) => ({
      ...prev,
      [tourId]: { ...prev[tourId], [field]: num },
    }));
  };

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setConfirmOpen(true);
  };

  const confirmSave = async () => {
    setConfirmOpen(false);
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(edits).map(([id, patch]) =>
          updateMutation.mutateAsync({ id: Number(id), patch }),
        ),
      );
      toast.success("تغییرات موجودی و قیمت با موفقیت ذخیره شد");
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
        <h1 className="text-xl font-extrabold text-foreground">
          مدیریت موجودی و قیمت‌ها
        </h1>
        <Button
          onClick={handleSaveClick}
          disabled={!hasChanges || isSaving}
          className="w-fit"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">تور</th>
              <th className="px-4 py-3 text-right">قیمت</th>
              <th className="px-4 py-3 text-right">موجودی</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {data?.tours.map((tour) => {
              const isDirty = tour.id in edits;
              return (
                <tr
                  key={tour.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {tour.name}
                    {isDirty && (
                      <span className="mr-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        تغییر یافته
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={displayValue(tour, "price")}
                      onChange={(e) =>
                        handleFieldChange(tour.id, "price", e.target.value)
                      }
                      className="w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-foreground outline-none focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={displayValue(tour, "quantity")}
                      onChange={(e) =>
                        handleFieldChange(tour.id, "quantity", e.target.value)
                      }
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-foreground outline-none focus:border-primary"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={buildPageHref}
      />

      {hasChanges && (
        <p className="text-xs text-muted-foreground">
          * {Object.keys(edits).length} مورد تغییر داده شده که هنوز ذخیره نشده —
          تا زدن دکمه‌ی «ذخیره» اعمال نمی‌شود.
        </p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="ذخیره‌ی تغییرات"
        description={`آیا از ذخیره‌ی تغییرات قیمت/موجودی برای ${Object.keys(edits).length} تور مطمئن هستید؟`}
        confirmLabel="ذخیره شود"
        onConfirm={confirmSave}
        onCancel={cancelSave}
      />
    </div>
  );
}
