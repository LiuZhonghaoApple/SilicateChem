import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  company: z.string().min(2, "Company name is required").max(180),
  email: z.string().email("Valid email is required").max(254),
  country: z.string().min(2, "Country is required").max(120),
  product: z.string().max(180).optional(),
  quantity: z.string().max(120).optional(),
  message: z.string().min(10, "Please provide inquiry details").max(5_000),
  requestType: z.enum(["quote", "contact", "tds", "sample"]).optional(),
  source: z.string().max(300).optional(),
  sourcePath: z.string().max(500).optional(),
  landingPage: z.string().max(1_000).optional(),
  referrer: z.string().max(1_000).optional(),
  utmSource: z.string().max(300).optional(),
  utmMedium: z.string().max(300).optional(),
  utmCampaign: z.string().max(300).optional(),
  utmTerm: z.string().max(300).optional(),
  utmContent: z.string().max(300).optional(),
  visitorId: z.string().max(100).optional(),
  turnstileToken: z.string().max(4_000).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
