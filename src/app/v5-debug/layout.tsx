import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function V5DebugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
