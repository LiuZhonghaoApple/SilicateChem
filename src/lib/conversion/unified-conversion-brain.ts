import type { RfqIntentLevel } from "@/lib/rfq/rfq-intent-score";
import type { UnifiedInput } from "@/lib/conversion/conversion-input-normalizer";

export type ConversionMode = "trust" | "nurture" | "convert";

export type ConversionIntensity = "low" | "medium" | "high";

export type ConversionPrimaryCTA = "none" | "rfq" | "quote" | "contact";

export type ConversionOutput = {
  mode: ConversionMode;
  intensity: ConversionIntensity;
  primaryCTA: ConversionPrimaryCTA;
  showTrust: boolean;
  showRFQ: boolean;
  showQuoteCTA: boolean;
  confidence: number;
};

const TRUST_SIGNAL_BOOST: Record<string, number> = {
  export: 10,
  product: 15,
  docs: 20,
  factory: 10,
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToLevel(score: number): RfqIntentLevel {
  if (score <= 39) return "low";
  if (score <= 69) return "medium";
  return "high";
}

function applyTrustBoost(input: UnifiedInput): number {
  let score = input.baseIntentScore;
  const signals = new Set(input.trustSignals);

  for (const [signal, bonus] of Object.entries(TRUST_SIGNAL_BOOST)) {
    if (signals.has(signal)) score += bonus;
  }

  score += input.engagementScore / 10;
  score += input.productSignalStrength / 20;

  return clampScore(score);
}

/**
 * V3 unified conversion decision engine — accepts UnifiedInput only.
 */
export function unifiedConversionBrain(input: UnifiedInput): ConversionOutput {
  void input.pageType;

  const adjustedScore = applyTrustBoost(input);
  const adjustedLevel = scoreToLevel(adjustedScore);
  const baseLevel = scoreToLevel(input.baseIntentScore);

  // RULE 1 — HIGH INTENT (strict priority)
  if (adjustedScore >= 70 || baseLevel === "high" || adjustedLevel === "high") {
    return {
      mode: "convert",
      intensity: "high",
      primaryCTA: "rfq",
      showTrust: true,
      showRFQ: true,
      showQuoteCTA: false,
      confidence: adjustedScore,
    };
  }

  // RULE 2 — MID INTENT
  if (adjustedScore >= 40 && adjustedScore <= 69) {
    return {
      mode: "nurture",
      intensity: "medium",
      primaryCTA: "quote",
      showTrust: true,
      showRFQ: false,
      showQuoteCTA: true,
      confidence: adjustedScore,
    };
  }

  // RULE 3 — LOW INTENT
  return {
    mode: "trust",
    intensity: "low",
    primaryCTA: "none",
    showTrust: true,
    showRFQ: false,
    showQuoteCTA: false,
    confidence: adjustedScore,
  };
}

export type { UnifiedInput } from "@/lib/conversion/conversion-input-normalizer";
