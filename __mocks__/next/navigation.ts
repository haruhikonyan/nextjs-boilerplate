import { vi } from "vitest";

export const redirect = vi.fn();
export const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
