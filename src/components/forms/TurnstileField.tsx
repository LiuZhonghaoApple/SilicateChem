"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

export type TurnstileFieldHandle = {
  execute: () => void;
  reset: () => void;
};

type TurnstileFieldProps = {
  onSuccess: (token: string) => void;
  onError: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export const TurnstileField = forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  function TurnstileField({ onSuccess, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    useImperativeHandle(ref, () => ({
      execute: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.execute(widgetIdRef.current);
        } else {
          onErrorRef.current();
        }
      },
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY || !containerRef.current) return;

      const renderWidget = () => {
        if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          size: "invisible",
          callback: (token: string) => onSuccessRef.current(token),
          "error-callback": () => onErrorRef.current(),
          "expired-callback": () => onErrorRef.current(),
        });
      };

      if (window.turnstile) {
        renderWidget();
      } else {
        window.onTurnstileLoad = renderWidget;

        if (!document.querySelector('script[src*="turnstile/v0/api.js"]')) {
          const script = document.createElement("script");
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
          script.async = true;
          document.head.appendChild(script);
        }
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;

    return <div ref={containerRef} className="sr-only" aria-hidden="true" />;
  }
);
