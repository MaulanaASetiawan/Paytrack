"use client";

import { useState } from "react";

interface CurrencyInputProps {
  name: string;
  defaultValue?: number | string;
  required?: boolean;
  placeholder?: string;
  id?: string;
  onValueChange?: (val: number) => void;
}

export default function CurrencyInput({ name, defaultValue, required, placeholder, id, onValueChange }: CurrencyInputProps) {

  const formatIDR = (value: string | number) => {
    if (!value) return "";
    const num = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const [displayValue, setDisplayValue] = useState<string>(formatIDR(defaultValue || ""));

  const rawValue = displayValue.replace(/\D/g, "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw) {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(parseInt(raw, 10)));
      if (onValueChange) onValueChange(parseInt(raw, 10));
    } else {
      setDisplayValue("");
      if (onValueChange) onValueChange(0);
    }
  };

  return (
    <>
      <input type="hidden" name={name} value={rawValue} />
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-sm font-medium text-gray-500">Rp</span>
        </div>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          required={required}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-700 bg-neutral-800 py-2 pl-9 pr-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>
    </>
  );
}
