import { BASE_URL } from "@/site-config/base-url";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShrinkifyUrl(shortCode: string) {
  return `${BASE_URL}/r/${shortCode}`;
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false;
  }
}

export function ensureHttps(url: string): string {
  if (url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return `https://${url}`;
}

export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function stripHttp(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
