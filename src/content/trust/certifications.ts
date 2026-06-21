/** Verified honors and credentials from INV/KB — no ISO certificate files in sources. */

export const ASSOCIATION_MEMBERSHIP = {
  title: "China Inorganic Silicates Industry Association",
  role: "Member unit (副会长单位)",
  source: "INV about.asp",
} as const;

export const INDUSTRY_HONORS = [
  {
    title: "National Enterprise Credit Rating AAA",
    subtitle: "国家企业信用等级评价3A级企业",
    year: null,
  },
  {
    title: "Specialized and Sophisticated “Little Giant” Enterprise",
    subtitle: "专精特新“小巨人”企业",
    year: null,
  },
  {
    title: "National Manufacturing Single-Champion Enterprise",
    subtitle: "国家制造业单项冠军企业",
    year: "2022",
  },
  {
    title: "Shandong Provincial New Materials Leading Enterprise Top 50",
    subtitle: null,
    year: null,
  },
  {
    title: "Shandong Provincial Technology Innovation Demonstration Enterprise",
    subtitle: null,
    year: null,
  },
  {
    title: "Shandong Provincial Gazelle Enterprise",
    subtitle: null,
    year: null,
  },
  {
    title: "2013 Weifang Integrity Private Enterprise",
    subtitle: "2013年度诚信民营企业",
    year: "2013",
  },
] as const;

export const RD_RECOGNITION = [
  {
    title: "Weifang Science and Technology Progress Award — 2nd Prize",
    source: "INV tec.asp",
  },
  {
    title: "Shandong Science and Technology Progress Award — 2nd Prize",
    source: "INV tec.asp",
  },
  {
    title: "Shandong Marine Science and Technology Innovation Award — 2nd Prize",
    source: "INV tec.asp",
  },
  {
    title: "Shandong Enterprise Technology Innovation Award — Excellent Paper 1st Prize",
    source: "INV tec.asp",
  },
  {
    title: "Maker China Shandong — Enterprise Group Winner",
    source: "INV tec.asp",
  },
  {
    title: "Technology Innovation Advanced Enterprise",
    source: "INV tec.asp",
  },
] as const;

export const TECHNICAL_CERTIFICATIONS_PLACEHOLDER = {
  title: "ISO / QMS Certificates",
  status: "not_available",
  note: "ISO 9001, ISO 14001, and equivalent QMS certificate files are not present in verified source materials. Contact us for current compliance documentation on request.",
} as const;

export const CERTIFICATE_IMAGE_NOTE =
  "Certificate scans from historical corporate materials are not yet in the website asset pack. Placeholder blocks shown until high-resolution images are available.";
