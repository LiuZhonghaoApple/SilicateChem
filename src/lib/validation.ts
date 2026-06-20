import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  country: z.string().min(2, "Country is required"),
  product: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, "Please provide inquiry details"),
  requestType: z.enum(["quote", "contact", "tds", "sample"]).optional(),
  source: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
