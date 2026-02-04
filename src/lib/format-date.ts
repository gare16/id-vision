export function formatDateToLocaleString(
  input: Date | string | undefined,
): string {
  if (!input) {
    return "N/A";
  }
  const date = new Date(input);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(date);
}
