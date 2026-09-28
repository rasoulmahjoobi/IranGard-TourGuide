"use client";

import { useEffect } from "react";

/** اگه صفحه‌ی جاری بعد از تغییر دیتا (حذف/فیلتر) دیگه معتبر نبود، خودکار به آخرین صفحه‌ی معتبر برمی‌گرده */
export function useAutoCorrectPage(
  page: number,
  totalPages: number,
  isLoading: boolean,
  onCorrect: (validPage: number) => void
) {
  useEffect(() => {
    if (!isLoading && page > totalPages) {
      onCorrect(totalPages);
    }
  }, [isLoading, page, totalPages, onCorrect]);
}