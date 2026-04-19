import type * as React from "react";
import { vi } from "vitest";

export default vi.fn(
  ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
);
