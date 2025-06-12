"use client";

import { SWRConfig } from "swr";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SWRConfig value={{ revalidateOnFocus: false }}>{children}</SWRConfig>;
}
