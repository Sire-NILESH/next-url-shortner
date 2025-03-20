import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
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
