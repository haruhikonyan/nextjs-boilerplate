import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS クラス名をマージするユーティリティ。
 * clsx で条件付きクラスを結合し、tailwind-merge で競合するクラスを解決する。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
