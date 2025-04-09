export function formatNumberValue(locale = "en-US") {
  return new Intl.NumberFormat(locale);
}

export function formatNumber(
  num: number | undefined | null,
  locale = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  if (num === null || num === undefined) {
    return "";
  }

  const million = 1000000;
  const billion = 1000000000;
  const trillion = 1000000000000;

  if (Math.abs(num) >= trillion) {
    const formatted = (num / trillion).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + "T"
      : formatted + "T";
  } else if (Math.abs(num) >= billion) {
    const formatted = (num / billion).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + "B"
      : formatted + "B";
  } else if (Math.abs(num) >= million) {
    const formatted = (num / million).toFixed(2);
    return formatted.endsWith(".00")
      ? formatted.slice(0, -3) + "M"
      : formatted + "M";
  } else {
    const formatter = new Intl.NumberFormat(locale, options);
    return formatter.format(num);
  }
}
