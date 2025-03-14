export function formatNumberValue(locale = "en-US") {
  return new Intl.NumberFormat(locale);
}
