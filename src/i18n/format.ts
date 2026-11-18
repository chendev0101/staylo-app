/** Listings are priced in TWD; show "NT$" with locale digit grouping in every language. */
export function formatPrice(amount: number, language: string): string {
  return `NT$${new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(amount)}`;
}
