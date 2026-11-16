"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type Evento =
  | "cta_click"
  | "outbound_alphadl"
  | "whatsapp_click"
  | "tool_start"
  | "tool_complete"
  | "form_start"
  | "form_submit"
  | "engaged_read";

/** Envia evento ao GA4. Sem consentimento, o Consent Mode descarta cookies e identificadores. */
export function track(evento: Evento, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", evento, { ...params, page_path: window.location.pathname });
}
