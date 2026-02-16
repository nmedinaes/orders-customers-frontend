"use client";

import { useState, useCallback } from "react";

export const MAX_PRICE = 999999999.99;

export function usePriceFormat(maxPrice: number = MAX_PRICE) {
  const [priceDisplay, setPriceDisplay] = useState("");

  const formatPrice = useCallback(
    (value: number): string => {
      if (Number.isNaN(value) || value < 0) return "";
      if (value === 0) return "";
      const clamped = Math.min(value, maxPrice);
      return clamped.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
    [maxPrice]
  );

  const parsePrice = useCallback(
    (str: string): number => {
      const cleaned = str.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
      const n = parseFloat(cleaned);
      return Number.isNaN(n) ? 0 : Math.min(Math.max(n, 0), maxPrice);
    },
    [maxPrice]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
        .replace(/[^\d,]/g, "")
        .replace(/,/g, (m, i, s) => (s.indexOf(",") === i ? m : ""));
      const commaIndex = raw.indexOf(",");
      const hasComma = commaIndex >= 0;
      const intPart = hasComma ? raw.slice(0, commaIndex) : raw;
      const decPart = hasComma ? raw.slice(commaIndex + 1).slice(0, 2) : "";
      const combined = decPart ? `${intPart}.${decPart}` : intPart || "0";
      const num = parseFloat(combined);
      if (Number.isNaN(num)) {
        setPriceDisplay("");
        return;
      }
      const clamped = Math.min(Math.max(num, 0), maxPrice);
      const intVal = Math.floor(clamped);
      const base =
        intVal > 0 || hasComma ? intVal.toLocaleString("es-CO") : "";
      setPriceDisplay(base + (hasComma ? "," + decPart : ""));
    },
    [maxPrice]
  );

  const handlePriceBlur = useCallback(() => {
    setPriceDisplay(formatPrice(parsePrice(priceDisplay)));
  }, [priceDisplay, formatPrice, parsePrice]);

  return {
    priceDisplay,
    setPriceDisplay,
    formatPrice,
    parsePrice,
    handlePriceChange,
    handlePriceBlur,
  };
}
