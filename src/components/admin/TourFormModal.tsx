"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  ImagePlus,
  MapPin,
  Tag,
  Calendar,
  DollarSign,
  Boxes,
  FileText,
} from "lucide-react";
import {
  Modal,
  Input,
  Select,
  Button,
  PersianDatePicker,
} from "@/src/components/ui";
import { RichTextEditor } from "./RichTextEditor";
import type { Category, Subcategory, Tour } from "@/src/types/tour";

const tourFormSchema = z.object({
  name: z.string().min(3, "نام تور باید حداقل ۳ کاراکتر باشد"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  subcategory: z.string().min(1, "زیردسته الزامی است"),
  location: z.string().min(2, "مقصد الزامی است"),
  duration: z.string().min(1, "مدت تور الزامی است"),
  price: z.coerce.number().positive("قیمت باید بزرگ‌تر از صفر باشد"),
  quantity: z.coerce
    .number({ message: "موجودی الزامی است" })
    .int("موجودی باید عدد صحیح باشد")
    .min(1, "موجودی باید حداقل ۱ باشد"),
});

type TourFormInput = z.input<typeof tourFormSchema>;
export type TourFormValues = z.output<typeof tourFormSchema>;

interface TourFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: TourFormValues & {
      thumbnail: string;
      departureDate: string;
      description: string;
    },
  ) => void;
  categories: Category[];
  subcategories: Subcategory[];
  initialTour?: Tour;
}

function toFormDefaults(tour?: Tour): TourFormValues {
  if (!tour) {
    return {
      name: "",
      category: "",
      subcategory: "",
      location: "",
      duration: "",
      price: 0,
      quantity: 1,
    };
  }
  return {
    name: tour.name,
    category: String(tour.category),
    subcategory: String(tour.subcategory),
    location: tour.location,
    duration: tour.duration,
    price: tour.price,
    quantity: tour.quantity,
  };
}

export function TourFormModal({
  open,
  onClose,
  onSubmit,
  categories,
  subcategories,
  initialTour,
}: TourFormModalProps) {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [date, setDate] = useState<DateObject | null>(null);
  const [description, setDescription] = useState("");
  const [dateError, setDateError] = useState("");
  const [descError, setDescError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TourFormInput, unknown, TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: toFormDefaults(initialTour),
  });

  useEffect(() => {
    if (open) {
      reset(toFormDefaults(initialTour));
      setThumbnail(initialTour?.thumbnail ?? "");
      setDescription(initialTour?.description?.replace(/<\/?p>/g, "") ?? "");
      setDate(null);
      setDateError("");
      setDescError("");
    }
  }, [open, initialTour, reset]);

  const selectedCategory = watch("category");
  const filteredSubcategories = subcategories.filter(
    (s) => String(s.category) === selectedCategory,
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (values: TourFormValues) => {
    const plainDesc = description.replace(/<[^>]*>/g, "").trim();
    let hasError = false;

    if (plainDesc.length < 10) {
      setDescError("توضیحات باید حداقل ۱۰ کاراکتر باشد");
      hasError = true;
    } else {
      setDescError("");
    }

    if (!date && !initialTour?.departureDate) {
      setDateError("تاریخ حرکت الزامی است");
      hasError = true;
    } else {
      setDateError("");
    }

    if (hasError) return;

    const departureDate = date
      ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD")
      : (initialTour!.departureDate as string);

    onSubmit({ ...values, thumbnail, departureDate, description });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialTour ? "ویرایش تور" : "افزودن تور جدید"}
    >
      <form
        onSubmit={handleSubmit(submit)}
        className="flex max-h-[75vh] flex-col gap-6 overflow-y-auto pl-1"
      >
        {/* آپلود تصویر — به‌شکل drag-zone خاص */}
        <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-linear-to-br from-muted to-card px-4 py-6 text-center transition hover:border-primary">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt="پیش‌نمایش"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-l from-primary to-coral text-white shadow-md">
                <ImagePlus className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                برای آپلود تصویر تور کلیک کنید
              </span>
              <span className="text-xs text-muted-foreground">JPG یا PNG</span>
            </>
          )}
          {thumbnail && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
              تغییر تصویر
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* اطلاعات پایه */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Tag className="h-4 w-4" />
            اطلاعات پایه
          </div>
          <Input
            label="نام تور:"
            {...register("name")}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="دسته‌بندی:"
              {...register("category")}
              error={errors.category?.message}
            >
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              label="زیردسته:"
              {...register("subcategory")}
              error={errors.subcategory?.message}
            >
              <option value="">انتخاب کنید</option>
              {filteredSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* مقصد و زمان‌بندی */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-turquoise">
            <MapPin className="h-4 w-4" />
            مقصد و زمان‌بندی
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="مقصد:"
              {...register("location")}
              error={errors.location?.message}
            />
            <Input
              label="مدت تور:"
              placeholder="مثلا: ۲ روز و ۱ شب"
              {...register("duration")}
              error={errors.duration?.message}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              تاریخ حرکت:
            </label>
            <PersianDatePicker
              value={date}
              onChange={setDate}
              placeholder={
                initialTour?.departureDate
                  ? "تاریخ فعلی حفظ می‌شود، برای تغییر کلیک کنید"
                  : "انتخاب تاریخ حرکت"
              }
              className="rounded-xl border border-border bg-card px-3.5 py-2.5"
            />
            {dateError && (
              <span className="text-xs text-red-600">{dateError}</span>
            )}
          </div>
        </div>

        {/* قیمت و موجودی */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-accent-foreground">
            <DollarSign className="h-4 w-4" />
            قیمت و موجودی
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="قیمت (تومان):"
              type="number"
              {...register("price")}
              error={errors.price?.message}
            />
            <Input
              label="موجودی:"
              type="number"
              min={1}
              {...register("quantity")}
              error={errors.quantity?.message}
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Boxes className="h-3 w-3" />
            امتیاز تور توسط نظرات مشتریان تعیین می‌شود و از این بخش قابل ویرایش
            نیست.
          </p>
        </div>

        {/* توضیحات */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-coral">
            <FileText className="h-4 w-4" />
            توضیحات تور
          </div>
          <RichTextEditor
            label=""
            value={description}
            onChange={setDescription}
            error={descError}
          />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit">ذخیره تور</Button>
        </div>
      </form>
    </Modal>
  );
}
