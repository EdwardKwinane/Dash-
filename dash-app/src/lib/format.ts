/**
 * Currency formatting for the Dash# storefront.
 *
 * Prices are stored as integer cents throughout the application so that
 * arithmetic never introduces floating-point currency errors. Formatting is
 * deterministic (comma thousands separator, dot decimal separator) instead of
 * relying on ICU locale data, which differs between Node versions.
 */
export function formatPrice(priceInCents: number): string {
  const safeCents = Number.isFinite(priceInCents) ? Math.round(priceInCents) : 0;
  const sign = safeCents < 0 ? "-" : "";
  const absolute = Math.abs(safeCents);
  const rands = Math.floor(absolute / 100).toLocaleString("en-US");
  const cents = String(absolute % 100).padStart(2, "0");

  return `${sign}R${rands}.${cents}`;
}
