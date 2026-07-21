export type AdvisorSource = {
  label: string;
  href: string;
};

export type AdvisorKnowledgeEntry = {
  id: string;
  title: string;
  keywords: string[];
  patterns: RegExp[];
  answer: string;
  context: string;
  sources: AdvisorSource[];
};

const productHub: AdvisorSource = {
  label: "Sodium Metasilicate Product Hub",
  href: "/products/sodium-metasilicate",
};

const downloads: AdvisorSource = {
  label: "Buyer Documents",
  href: "/downloads",
};

const contact: AdvisorSource = {
  label: "Contact Sales",
  href: "/contact?type=quote&product=Sodium%20Metasilicate",
};

export const advisorKnowledge: AdvisorKnowledgeEntry[] = [
  {
    id: "quotation",
    title: "Quotation and RFQ preparation",
    keywords: [
      "price",
      "quote",
      "quotation",
      "cost",
      "offer",
      "rfq",
      "discount",
      "payment",
      "报价",
      "价格",
      "询价",
    ],
    patterns: [
      /\b(price|quote|quotation|cost|offer|rfq|discount|payment terms?)\b/i,
      /(报价|价格|询价|折扣|付款方式)/,
    ],
    answer:
      "Final pricing must be confirmed by our sales team. To prepare a comparable factory quotation, please provide: product grade or form, target specification, quantity, packing, destination port, trade term (FOB or CIF), required documents, and target delivery time. I can organize those details before you continue on WhatsApp.",
    context:
      "Never generate or promise a price, discount, payment term, stock status, delivery date, exclusivity, or contract term. A useful RFQ includes product grade or form, specification, quantity, packing, destination port, FOB/CIF preference, required documents, and target delivery time. Final commercial terms require human sales confirmation.",
    sources: [productHub, contact],
  },
  {
    id: "documents",
    title: "MSDS, COA, TDS and certificates",
    keywords: [
      "msds",
      "sds",
      "coa",
      "tds",
      "certificate",
      "iso",
      "reach",
      "document",
      "文件",
      "证书",
      "化验单",
    ],
    patterns: [
      /\b(msds|sds|coa|tds|certificate|iso|reach|documents?)\b/i,
      /(文件|证书|化验单|检测报告)/,
    ],
    answer:
      "The download center provides available English and Chinese MSDS files, ISO certificates, REACH documentation, customs registration, company credentials, and the product brochure. Batch-specific COA and order-specific TDS should be requested with the product grade, quantity, and shipment requirement.",
    context:
      "Public downloads include English and Chinese MSDS files for anhydrous and pentahydrate sodium metasilicate, ISO 9001, ISO 14001, REACH, customs registration, business credentials, and a product brochure. Batch-specific COA and order-specific TDS/SDS require a sales request with grade and order details.",
    sources: [downloads, contact],
  },
  {
    id: "anhydrous",
    title: "Anhydrous sodium metasilicate",
    keywords: [
      "anhydrous",
      "low moisture",
      "dry blend",
      "6834-92-0",
      "无水",
    ],
    patterns: [/\banhydrous\b|6834-92-0|low[- ]moisture/i, /无水偏硅酸钠|无水/],
    answer:
      "Anhydrous sodium metasilicate is the low-moisture Na₂SiO₃ grade commonly reviewed for dry blends, high-alkalinity detergents, industrial cleaning, and metal degreasing. Current reference values include SiO₂ ≥ 46.0%, Na₂O ≥ 50.0%, Fe ≤ 0.02%, and moisture ≤ 1.0%; final values must be confirmed against the selected specification and order documents.",
    context:
      "Anhydrous sodium metasilicate: CAS 6834-92-0, formula Na2SiO3, white powder or fine granules. Website reference values: SiO2 >= 46.0%, Na2O >= 50.0%, Fe <= 0.02%, moisture <= 1.0%. Common uses include dry blends, high-alkalinity detergents, industrial cleaners, metal degreasing, paper/pulp formulations, and selected processing applications. Keep sealed and dry.",
    sources: [
      {
        label: "Anhydrous Sodium Metasilicate",
        href: "/products/sodium-metasilicate-anhydrous",
      },
      downloads,
    ],
  },
  {
    id: "pentahydrate",
    title: "Sodium metasilicate pentahydrate",
    keywords: [
      "pentahydrate",
      "crystal",
      "hydrated",
      "10213-79-3",
      "五水",
    ],
    patterns: [/\bpentahydrate\b|10213-79-3|hydrated|crystalline/i, /五水偏硅酸钠|五水/],
    answer:
      "Sodium metasilicate pentahydrate is the crystalline Na₂SiO₃·5H₂O grade used in selected cleaning, textile, water-treatment, and metal-cleaning formulations. Current reference values include SiO₂ ≥ 28.5%, Na₂O ≥ 29.0%, and Fe ≤ 0.02%; final grade values and particle size require specification confirmation.",
    context:
      "Sodium metasilicate pentahydrate: CAS 10213-79-3, formula Na2SiO3.5H2O, white crystalline granules or powder. Website reference values: SiO2 >= 28.5%, Na2O >= 29.0%, Fe <= 0.02%. Common uses include cleaning formulations, water-treatment blends, textile scouring/bleaching auxiliaries, and metal cleaning. Keep sealed and dry.",
    sources: [
      {
        label: "Sodium Metasilicate Pentahydrate",
        href: "/products/sodium-metasilicate-pentahydrate",
      },
      downloads,
    ],
  },
  {
    id: "granules",
    title: "Sodium metasilicate granules",
    keywords: [
      "granules",
      "granular",
      "mesh",
      "powder detergent",
      "low dust",
      "颗粒",
    ],
    patterns: [/\bgranul(es|ar)\b|mesh|low dust/i, /颗粒偏硅酸钠|颗粒/],
    answer:
      "Sodium metasilicate granules are the free-flowing Na₂SiO₃ form selected for easier handling, controlled dosing, and reduced dust. They are commonly reviewed for powder detergents and industrial cleaners. Current reference values include SiO₂ ≥ 46.0%, Na₂O ≥ 50.0%, Fe ≤ 0.02%, water insoluble ≤ 0.2%, and 8–40 mesh as a customizable particle-size reference.",
    context:
      "Sodium metasilicate granules: CAS 6834-92-0, formula Na2SiO3, white to off-white granules. Website reference values: SiO2 >= 46.0%, Na2O >= 50.0%, Fe <= 0.02%, water insoluble <= 0.2%, particle size 8-40 mesh customizable. Common uses include detergent builders, industrial cleaning, ceramics, metal treatment, and distributor stock. Granules support cleaner handling and reduced dust.",
    sources: [
      {
        label: "Sodium Metasilicate Granules",
        href: "/products/sodium-metasilicate-granules",
      },
      productHub,
    ],
  },
  {
    id: "sodium-silicate",
    title: "Liquid sodium silicate",
    keywords: [
      "sodium silicate",
      "water glass",
      "liquid silicate",
      "modulus",
      "1344-09-8",
      "硅酸钠",
      "水玻璃",
    ],
    patterns: [/\b(sodium silicate|water glass|liquid silicate|modulus)\b|1344-09-8/i, /(硅酸钠|水玻璃)/],
    answer:
      "Liquid sodium silicate (water glass) is quoted mainly by modulus, solid content, quantity, and packing. The current product range lists a modulus reference of 2.0–3.5, with 200 L drums, 1,000 L IBC tanks, or bulk tanker supply subject to order and destination confirmation. Solid sodium silicate should be specified separately.",
    context:
      "Liquid sodium silicate (water glass): CAS 1344-09-8, formula Na2O.nSiO2. The website lists a modulus reference range of 2.0-3.5. Buyers should confirm modulus, solid content, density, quantity, packing, and destination. Liquid packing references include 200 L drums, 1,000 L IBC tanks, and bulk tanker subject to confirmation. Solid form must be quoted separately.",
    sources: [
      {
        label: "Liquid Sodium Silicate",
        href: "/products/sodium-silicate",
      },
      contact,
    ],
  },
  {
    id: "packing-moq",
    title: "MOQ, packing and shipment preparation",
    keywords: [
      "moq",
      "minimum order",
      "packing",
      "packaging",
      "bag",
      "fcl",
      "container",
      "shipping",
      "port",
      "包装",
      "起订量",
      "装柜",
    ],
    patterns: [
      /\b(moq|minimum order|packing|packaging|bags?|fcl|container|shipping|destination port)\b/i,
      /(包装|起订量|装柜|目的港|海运)/,
    ],
    answer:
      "The website reference MOQ is typically one full container load, approximately 20–25 MT per grade. Common dry-product packing references are 25 kg or 50 kg woven bags with PE liner and 1,000 kg FIBC jumbo bags. Pallet, printed/neutral bag, loading quantity, and FOB/CIF shipment details must be confirmed for the destination and selected grade.",
    context:
      "Website procurement guidance lists a typical MOQ of one FCL, approximately 20-25 metric tons per grade. Dry-product packing references include 25 kg and 50 kg woven bags with PE liner plus 1,000 kg FIBC jumbo bags. Printed or neutral bags and palletized/non-palletized loading require confirmation. Shipment quotations require destination port and FOB/CIF preference.",
    sources: [productHub, contact],
  },
  {
    id: "product-selection",
    title: "Grade and application selection",
    keywords: [
      "which grade",
      "choose",
      "recommend",
      "application",
      "detergent",
      "cleaning",
      "water treatment",
      "textile",
      "paper",
      "ceramic",
      "用途",
      "推荐",
      "怎么选",
    ],
    patterns: [
      /\b(which grade|choose|recommend|application|detergent|cleaning|water treatment|textile|paper|ceramic)\b/i,
      /(用途|推荐|怎么选|洗涤剂|水处理|纺织|造纸|陶瓷)/,
    ],
    answer:
      "Selection starts with the application and required form. Granules are often reviewed for powder detergents and cleaner handling; anhydrous grade suits low-moisture dry blends and high-alkalinity cleaning systems; pentahydrate is the crystalline hydrate grade used in selected cleaning, textile, water-treatment, and metal-cleaning formulations. Please share your application, target specification, and preferred form so sales can confirm the grade.",
    context:
      "Grade-selection guide: granules are commonly reviewed for powder detergents, controlled dosing, and reduced dust; anhydrous grade is used for low-moisture dry blends and high-alkalinity cleaning systems; pentahydrate is a crystalline hydrate grade for selected cleaning, textile, water-treatment, and metal-cleaning formulations. Selection must be confirmed against application, specification, form, and required documents.",
    sources: [
      productHub,
      { label: "Industry Applications", href: "/applications" },
    ],
  },
  {
    id: "company-contact",
    title: "Factory contact and human sales handoff",
    keywords: [
      "contact",
      "whatsapp",
      "email",
      "factory",
      "sales",
      "human",
      "人工",
      "联系",
      "工厂",
    ],
    patterns: [
      /\b(contact|whatsapp|email|factory|sales|human agent|representative)\b/i,
      /(人工|联系|销售|工厂|邮箱|电话)/,
    ],
    answer:
      "Shandong Zhongzhi Chemical Technology Co., Ltd. can be reached by WhatsApp or telephone at +86 17685880260 and by email at info@silicatechem.com. Use the WhatsApp handoff below to send your inquiry summary to a human sales representative.",
    context:
      "Company: Shandong Zhongzhi Chemical Technology Co., Ltd., Shandong, China. WhatsApp and telephone: +86 17685880260. Email: info@silicatechem.com. Human sales confirmation is required for commercial commitments.",
    sources: [contact],
  },
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function findLocalAnswer(message: string): AdvisorKnowledgeEntry | null {
  const normalized = normalize(message);
  return (
    advisorKnowledge.find((entry) =>
      entry.patterns.some((pattern) => pattern.test(normalized))
    ) ?? null
  );
}

export function retrieveKnowledge(
  message: string,
  limit = 3
): AdvisorKnowledgeEntry[] {
  const normalized = normalize(message);
  const scored = advisorKnowledge
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce(
        (total, keyword) =>
          total + (normalized.includes(normalize(keyword)) ? 2 : 0),
        entry.patterns.some((pattern) => pattern.test(normalized)) ? 4 : 0
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  if (scored.length > 0) return scored;

  return advisorKnowledge.filter((entry) =>
    ["product-selection", "quotation", "company-contact"].includes(entry.id)
  );
}

export function buildKnowledgeContext(entries: AdvisorKnowledgeEntry[]): string {
  return entries
    .map((entry) => `[${entry.id}] ${entry.title}\n${entry.context}`)
    .join("\n\n");
}

export function uniqueSources(entries: AdvisorKnowledgeEntry[]): AdvisorSource[] {
  const seen = new Set<string>();
  return entries
    .flatMap((entry) => entry.sources)
    .filter((source) => {
      if (seen.has(source.href)) return false;
      seen.add(source.href);
      return true;
    })
    .slice(0, 3);
}

export const advisorFallback = {
  answer:
    "I cannot confirm that point from the approved website information. Please send the product, quantity, packing, destination port, and required documents to our sales team for a verified answer.",
  sources: [contact, productHub],
};
