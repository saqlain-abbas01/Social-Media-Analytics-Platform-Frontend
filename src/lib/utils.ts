import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string | Date | null | undefined): string {
  if (!isoDate) return "N/A";

  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;

  // If invalid date
  if (isNaN(date.getTime())) return "Invalid Date";

  // Example: "Nov 7, 2025, 7:01 PM"
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
