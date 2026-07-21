import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SilicateChem 管理后台",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
