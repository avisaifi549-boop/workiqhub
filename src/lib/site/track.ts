/**
 * Lightweight, privacy-safe interaction tracking.
 * Pushes named events (no personal data) onto window.dataLayer so an analytics
 * tool can be attached later without touching component code.
 */

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props, ts: Date.now() });
}
