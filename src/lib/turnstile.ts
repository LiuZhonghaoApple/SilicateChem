const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileConfiguration = {
  siteKeyConfigured: boolean;
  secretConfigured: boolean;
  enabled: boolean;
  misconfigured: boolean;
};

/**
 * Read only presence flags for the public/private Turnstile key pair.
 *
 * Both keys are required before server verification is enabled. Keeping this
 * check in one pure helper makes partial Vercel environment configuration
 * visible and easy to exercise without exposing either key value.
 */
export function getTurnstileConfiguration(): TurnstileConfiguration {
  const siteKeyConfigured = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  );
  const secretConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());

  return {
    siteKeyConfigured,
    secretConfigured,
    enabled: siteKeyConfigured && secretConfigured,
    misconfigured: siteKeyConfigured !== secretConfigured,
  };
}

/**
 * Enable the verification path when configured, and also when the pair is
 * partial so the inquiry endpoint fails closed instead of silently accepting
 * submissions with a broken production configuration.
 */
export function isTurnstileVerificationEnabled(): boolean {
  const config = getTurnstileConfiguration();
  if (config.misconfigured) {
    // Deliberately do not print either key; this message is the audit signal
    // for a partial Vercel configuration and prevents silent key drift.
    console.error(
      "[INQUIRY] Turnstile misconfigured — set both NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY"
    );
  }
  return config.enabled || config.misconfigured;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error(
      "[INQUIRY] Turnstile is enabled but TURNSTILE_SECRET_KEY is missing"
    );
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) return false;

    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[INQUIRY] Turnstile verification request failed:", error);
    return false;
  }
}
