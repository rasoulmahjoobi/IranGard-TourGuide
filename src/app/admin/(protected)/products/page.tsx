"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCategories } from "@/src/hooks/useCategories";
import { useSubcategories } from "@/src/hooks/useSubcategories";
import { useTours } from "@/src/hooks/useTours";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
} from "@/src/hooks/useTourMutations";
import { TourImage } from "@/src/components/tour/TourImage";
import { getCategoryGradient } from "@/src/lib/tourVisuals";
import { formatPrice } from "@/src/lib/format";
import {
  SearchInput,
  Select,
  Button,
  Pagination,
  ConfirmDialog,
  PageLoader,
} from "@/src/components/ui";
import {
  TourFormModal,
  type TourFormValues,
} from "@/src/components/admin/TourFormModal";
import type { Tour } from "@/src/types/tour";

const PAGE_SIZE = 5;

type SubmittedValues = TourFormValues & {
  thumbnail: string;
  gallery: string[];
  departureDate: string;
  description: string;
};

type PendingAction =
  | { type: "add"; values: SubmittedValues }
  | { type: "edit"; tour: Tour; values: SubmittedValues }
  | { type: "delete"; id: number; name: string }
  | null;

export default function AdminProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("category") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 400);
  const prevSearchRef = useRef(debouncedSearch);

  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const { data, isLoading } = useTours({
    q: debouncedSearch || undefined,
    category: categoryId ? Number(categoryId) : undefined,
    _page: page,
    _limit: PAGE_SIZE,
  });

  const createMutation = useCreateTour();
  const updateMutation = useUpdateTour();
  const deleteMutation = useDeleteTour();

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

  useEffect(() => {
    if (prevSearchRef.current === debouncedSearch) return;
    prevSearchRef.current = debouncedSearch;
    updateParams({ q: debouncedSearch || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const categoryName = (id: number) =>
    categories?.find((c) => c.id === id)?.name ?? "-";
  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const [formOpen, setFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | undefined>(undefined);

  const openAdd = () => {
    setEditingTour(undefined);
    setFormOpen(true);
  };
  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormOpen(true);
  };

  const [pending, setPending] = useState<PendingAction>(null);

  const handleFormSubmit = (values: SubmittedValues) => {
    setFormOpen(false);
    if (editingTour) {
      setPending({ type: "edit", tour: editingTour, values });
    } else {
      setPending({ type: "add", values });
    }
  };

  const handleDeleteClick = (tour: Tour) => {
    setPending({ type: "delete", id: tour.id, name: tour.name });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const confirmPending = () => {
    if (!pending) return;

    if (pending.type === "add") {
      createMutation.mutate(
        {
          name: pending.values.name,
          brand: "ایران گرد تور",
          image:
            pending.values.gallery.length > 0
              ? pending.values.gallery
              : pending.values.thumbnail
                ? [pending.values.thumbnail]
                : [],
          thumbnail: pending.values.thumbnail,
          price: pending.values.price,
          quantity: pending.values.quantity,
          category: Number(pending.values.category),
          subcategory: Number(pending.values.subcategory),
          location: pending.values.location,
          duration: pending.values.duration,
          rating: 0, // امتیاز جدید، تا زمانی که مشتری نظر ثبت نکرده صفر است
          departureDate: pending.values.departureDate,
          description: `<p>${pending.values.description}</p>`,
        },
        {
          onSuccess: () => toast.success("تور جدید با موفقیت اضافه شد"),
          onError: () => toast.error("خطا در افزودن تور"),
        },
      );
    }

    if (pending.type === "edit") {
      updateMutation.mutate(
        {
          id: pending.tour.id,
          patch: {
            name: pending.values.name,
            thumbnail: pending.values.thumbnail || pending.tour.thumbnail,
            image:
              pending.values.gallery.length > 0
                ? pending.values.gallery
                : pending.tour.image,
            price: pending.values.price,
            quantity: pending.values.quantity,
            category: Number(pending.values.category),
            subcategory: Number(pending.values.subcategory),
            location: pending.values.location,
            duration: pending.values.duration,
            // امتیاز عمداً اینجا آپدیت نمی‌شود — همیشه بر اساس نظرات مشتری‌ها می‌ماند
            departureDate: pending.values.departureDate,
            description: `<p>${pending.values.description}</p>`,
          },
        },
        {
          onSuccess: () => toast.success("تور با موفقیت ویرایش شد"),
          onError: () => toast.error("خطا در ویرایش تور"),
        },
      );
    }

    if (pending.type === "delete") {
      deleteMutation.mutate(pending.id, {
        onSuccess: () => toast.success("تور حذف شد"),
        onError: () => toast.error("خطا در حذف تور"),
      });
    }

    setPending(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-extrabold text-foreground">مدیریت تورها</h1>
        <Button onClick={openAdd} className="flex w-fit items-center gap-1.5">
          <Plus className="h-4 w-4" />
          افزودن تور
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="جستجوی نام تور..."
          />
        </div>
        <Select
          value={categoryId}
          onChange={(e) =>
            updateParams({ category: e.target.value || null, page: null })
          }
          className="sm:w-56"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 text-right">تصویر</th>
              <th className="px-4 py-3 text-right">نام تور</th>
              <th className="px-4 py-3 text-right">دسته بندی</th>
              <th className="px-4 py-3 text-right">قیمت</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6">
                  <PageLoader compact />
                </td>
              </tr>
            )}
            {!isLoading && data?.tours.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  موردی یافت نشد
                </td>
              </tr>
            )}
            {data?.tours.map((tour) => (
              <tr
                key={tour.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <TourImage
                      src={tour.thumbnail}
                      alt={tour.name}
                      gradient={getCategoryGradient(tour.category)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {tour.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryName(tour.category)}
                </td>
                <td className="px-4 py-3 text-accent-foreground">
                  {formatPrice(tour.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 font-medium">
                    <button
                      onClick={() => openEdit(tour)}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tour)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={buildPageHref}
      />

      <TourFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        categories={categories ?? []}
        subcategories={subcategories ?? []}
        initialTour={editingTour}
      />

      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.type === "delete"
            ? "حذف تور"
            : pending?.type === "edit"
              ? "ویرایش تور"
              : "افزودن تور"
        }
        description={
          pending?.type === "delete"
            ? `آیا از حذف «${pending.name}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`
            : pending?.type === "edit"
              ? "آیا از ذخیره‌ی تغییرات این تور مطمئن هستید؟"
              : "آیا از افزودن این تور جدید مطمئن هستید؟"
        }
        confirmLabel={
          isMutating
            ? "در حال پردازش..."
            : pending?.type === "delete"
              ? "حذف شود"
              : "ذخیره شود"
        }
        danger={pending?.type === "delete"}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
