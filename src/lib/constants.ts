export const SITE = {
  name: "SilicateChem",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://www.silicatechem.com",
  company: "Shandong Zhongzhi Chemical Technology Co., Ltd.",
  tagline: "Sodium Metasilicate Manufacturer in China",
  description:
    "Factory-direct sodium metasilicate manufacturer in Shandong, China. High purity granules, anhydrous, and pentahydrate for detergent, water treatment, and industrial chemical buyers.",
  email: "info@silicatechem.com",
  phone: "+86 17685880260",
  whatsapp: "+86 17685880260",
  location: "Shandong, China",
  capacity: "100,000+ Tons",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/applications", label: "Applications" },
  { href: "/certifications", label: "Certifications" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const COLORS = {
  deepBlue: "#0B2D5B",
  deepBlueDark: "#071F3F",
  accent: "#2E7D9A",
  lightGrey: "#F4F6F8",
  midGrey: "#E2E6EA",
  textMuted: "#5A6570",
} as const;
