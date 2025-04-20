import { BASE_URL } from "@/site-config/base-url";
import { z } from "zod";

// Helper to normalize both for comparison
const extractDomain = (url: string) => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

export const urlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (val) => {
        const targetDomain = extractDomain(val);
        const baseDomain = extractDomain(BASE_URL);
        return targetDomain !== baseDomain;
      },
      {
        message: "You cannot shorten a URL from this domain.",
      }
    ),
  customCode: z
    .string()
    .max(30, "Custom code must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen")
    .optional()
    .or(z.literal(""))
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
});

export type UrlFormData = z.infer<typeof urlSchema>;
