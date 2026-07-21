"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteShell({
  children,
  publicBefore,
  publicAfter,
}: {
  children: ReactNode;
  publicBefore: ReactNode;
  publicAfter: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="min-h-screen bg-[#F3F6F8]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20">
      {publicBefore}
      <main className="flex-1">{children}</main>
      {publicAfter}
    </div>
  );
}
