"use client";

import { useEffect, useState } from "react";
import { ENABLE_IMAGE_VISUAL_DEBUG, IMAGE_DEPLOYMENT_BINDINGS } from "@/lib/trust/image-deployment";

export function ImageVisualDebugPanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!ENABLE_IMAGE_VISUAL_DEBUG) return;

    const observer = new MutationObserver(() => {
      const nodes = document.querySelectorAll("[data-image-src]");
      setMounted(new Set([...nodes].map((n) => n.getAttribute("data-image-src") ?? "")));
    });

    observer.observe(document.body, { childList: true, subtree: true });
    const nodes = document.querySelectorAll("[data-image-src]");
    setMounted(new Set([...nodes].map((n) => n.getAttribute("data-image-src") ?? "")));

    return () => observer.disconnect();
  }, []);

  if (!ENABLE_IMAGE_VISUAL_DEBUG) return null;

  const total = IMAGE_DEPLOYMENT_BINDINGS.length;
  const mountedCount = IMAGE_DEPLOYMENT_BINDINGS.filter((b) => mounted.has(b.src)).length;

  return (
    <div className="fixed bottom-20 right-4 z-[9999] max-w-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-fuchsia-700"
      >
        Image Debug {mountedCount}/{total}
      </button>
      {open && (
        <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-fuchsia-300 bg-white p-3 text-[10px] shadow-xl">
          <p className="mb-2 font-bold text-fuchsia-800">
            ENABLE_IMAGE_VISUAL_DEBUG = true
          </p>
          <ul className="space-y-1">
            {IMAGE_DEPLOYMENT_BINDINGS.map((b) => {
              const isMounted = mounted.has(b.src);
              return (
                <li
                  key={b.src}
                  className={isMounted ? "text-green-700" : "text-red-600"}
                >
                  {isMounted ? "✓" : "○"} {b.image_id} → {b.used_component} ({b.page_route})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
