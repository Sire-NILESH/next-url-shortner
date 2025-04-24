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

export const originalUrlSchema = z
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
  );

export const shortCodeSchema = z
  .string()
  .max(30, "Custom code must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen");

export const urlNameSchema = z
  .string()
  .max(255, "Name must be less than 255 characters");

export const createShrinkifyUrlFormSchema = z.object({
  url: originalUrlSchema,
  customCode: shortCodeSchema
    .or(z.literal(""))
    .transform((val) => (val === null || val === "" ? undefined : val))
    .optional(),
});

export type CreateShrinkifyUrlFormData = z.infer<
  typeof createShrinkifyUrlFormSchema
>;

export const updateShrinkifyUrlSchema = z.object({
  id: z.coerce.number(),
  customCode: shortCodeSchema,
  name: urlNameSchema.optional(),
});

export type UpdateShrinkifyUrlData = z.infer<typeof updateShrinkifyUrlSchema>;

export const updateShrinkifyUrlFormSchema = z.object({
  customCode: shortCodeSchema,
  name: urlNameSchema.optional(),
});

export type UpdateShrinkifyUrlFormData = z.infer<typeof updateShrinkifyUrlFormSchema>;

