import { Section, SectionHeader } from "@/components/ui/Section";
import { CardGrid } from "@/components/modules/CardGrid";
import { BuyerChecklist } from "@/components/modules/BuyerChecklist";
import type { CardItem, Publishable } from "@/types";

/**
 * Composition layer for the buyer-decision block of a product page.
 *
 * This is the ONLY layer that knows which product is being rendered; the
 * modules it composes (CardGrid, BuyerChecklist) stay content-agnostic.
 * Product pages call this once instead of importing three modules each.
 *
 * Every section carries a stable `id` (anchor links, TOC, AI Overview
 * citation) and is named by its heading via `aria-labelledby`.
 */

export type BuyerDecisionData = {
  whyChoose: Publishable<readonly CardItem[]>;
  industryProof: Publishable<readonly CardItem[]>;
  buyerDecision: {
    whyChina: Publishable<readonly string[]>;
  };
  rfqInformation: Publishable<readonly string[]>;
};

export type BuyerDecisionLabels = {
  whyChooseTitle: string;
  whyChooseSubtitle?: string;
  industryTitle: string;
  industrySubtitle?: string;
  industryLinkLabel?: string;
  checklistTitle: string;
  checklistSubtitle?: string;
  rfqTitle: string;
};

const SECTION_IDS = {
  whyChoose: "why-choose",
  industry: "industry-applications",
  checklist: "buyer-checklist",
} as const;

export function BuyerDecisionSection({
  data,
  labels,
}: {
  data: BuyerDecisionData;
  labels: BuyerDecisionLabels;
}) {
  return (
    <>
      <Section
        id={SECTION_IDS.whyChoose}
        ariaLabelledBy={`${SECTION_IDS.whyChoose}-heading`}
      >
        <SectionHeader
          id={`${SECTION_IDS.whyChoose}-heading`}
          title={labels.whyChooseTitle}
          subtitle={labels.whyChooseSubtitle}
        />
        <CardGrid block={data.whyChoose} columns={4} />
      </Section>

      <Section
        id={SECTION_IDS.industry}
        background="grey"
        ariaLabelledBy={`${SECTION_IDS.industry}-heading`}
      >
        <SectionHeader
          id={`${SECTION_IDS.industry}-heading`}
          title={labels.industryTitle}
          subtitle={labels.industrySubtitle}
        />
        <CardGrid
          block={data.industryProof}
          columns={2}
          linkLabel={labels.industryLinkLabel}
        />
      </Section>

      <Section
        id={SECTION_IDS.checklist}
        ariaLabelledBy={`${SECTION_IDS.checklist}-heading`}
      >
        <SectionHeader
          id={`${SECTION_IDS.checklist}-heading`}
          title={labels.checklistTitle}
          subtitle={labels.checklistSubtitle}
        />
        <BuyerChecklist
          block={data.buyerDecision.whyChina}
          secondary={{ title: labels.rfqTitle, block: data.rfqInformation }}
        />
      </Section>
    </>
  );
}
