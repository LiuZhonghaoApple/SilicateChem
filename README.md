# SilicateChem — B2B Sodium Metasilicate Manufacturer Website

Factory-direct B2B website for **Shandong Zhongzhi Chemical Technology Co., Ltd.** (silicatechem.com).

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Zod form validation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Inquiry form submissions are logged to the server console in development. Configure `RESEND_API_KEY` for production email delivery.

## Project Structure

```
src/
├── app/              # Pages and API routes
├── components/       # UI, layout, SEO, forms
├── content/          # TypeScript content files (products, blog, FAQ)
├── lib/              # Constants, metadata helpers, validation
└── types/            # Shared TypeScript types

public/images/
├── products/         # Product photos (replace placeholders)
└── factory/          # Factory photos (replace placeholders)
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — primary SEO landing |
| `/about` | Company background |
| `/factory` | Production capacity & process |
| `/products` | Product hub |
| `/products/sodium-metasilicate-granules` | Main product (primary internal linking) |
| `/blog` | Technical articles |
| `/faq` | FAQ with schema markup |
| `/contact` | Lead generation form |

## SEO Features

- Per-page metadata and canonical URLs
- JSON-LD: Organization, Product, FAQ, Article, BreadcrumbList
- Auto-generated `sitemap.xml` and `robots.txt`

## Deploy

Recommended: [Vercel](https://vercel.com). Set `NEXT_PUBLIC_SITE_URL=https://silicatechem.com`.

## Replacing Placeholder Images

Add real photos to:

- `public/images/products/granules.jpg`
- `public/images/products/sodium-metasilicate-anhydrous.jpg`
- `public/images/products/sodium-metasilicate-pentahydrate.jpg`
- `public/images/products/sodium-silicate.jpg`
- `public/images/factory/aerial.jpg`

Then update the relevant page components to use `next/image`.
