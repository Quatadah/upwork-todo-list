import { Task } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sortTasks(
  a: Task,
  b: Task,
  order: "asc" | "desc" = "asc"
): number {
  const multiplier = order === "asc" ? 1 : -1;
  return multiplier * a.title.localeCompare(b.title);
}
