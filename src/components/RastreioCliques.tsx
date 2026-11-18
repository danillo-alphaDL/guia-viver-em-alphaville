"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Rastreia todo clique em link ou botão do site que não tem evento próprio.
 * Os que já têm (LinkRastreado, botão flutuante, barra do WhatsApp) levam `data-rastreado`
 * e ficam de fora, para o mesmo clique não contar duas vezes.
 *
 * Eventos (GA4):
 * - whatsapp_click: qualquer link para wa.me sem evento próprio (cta_id = data-cta ou "link-whatsapp").
 * - outbound_alphadl: link para alphadl.com.br sem evento próprio.
 * - ui_click: o resto, com link_text, link_url, link_type (interno, externo, botao) e area da página.
 * Nada do que a pessoa digita é enviado: só o texto visível do próprio botão, cortado em 80 caracteres.
 */
function area(el: Element): string {
  if (el.closest(".topo")) return "cabecalho";
  if (el.closest(".rodape")) return "rodape";
  if (el.closest(".hero, .pg-hero, .res-hero")) return "capa";
  if (el.closest("main")) return "conteudo";
  return "outra";
}

export function RastreioCliques() {
  useEffect(() => {
    function aoClicar(ev: MouseEvent) {
      const alvo = ev.target instanceof Element ? ev.target.closest("a, button, summary") : null;
      if (!alvo || alvo.closest("[data-rastreado]")) return;
      // Botão de envio de formulário: o formulário já registra form_submit.
      if (alvo instanceof HTMLButtonElement && alvo.type === "submit") return;

      const texto = (alvo.getAttribute("aria-label") || alvo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
      const ctaId = alvo.getAttribute("data-cta") || undefined;
      const onde = area(alvo);

      if (alvo instanceof HTMLAnchorElement) {
        const url = alvo.href;
        let destino: URL | null = null;
        try {
          destino = new URL(url);
        } catch {}
        const host = destino?.hostname ?? "";
        if (host === "wa.me" || host.endsWith("whatsapp.com")) {
          track("whatsapp_click", { cta_id: ctaId ?? "link-whatsapp", link_text: texto, area: onde });
          return;
        }
        if (host.endsWith("alphadl.com.br")) {
          track("outbound_alphadl", { cta_id: ctaId ?? "link-alphadl", destination: `${destino!.origin}${destino!.pathname}`, link_text: texto, area: onde });
          return;
        }
        const interno = host === window.location.hostname;
        track("ui_click", {
          link_text: texto,
          link_url: destino ? (interno ? destino.pathname : `${destino.origin}${destino.pathname}`) : url,
          link_type: interno ? "interno" : "externo",
          area: onde,
          cta_id: ctaId,
        });
        return;
      }
      track("ui_click", { link_text: texto, link_type: "botao", area: onde, cta_id: ctaId });
    }
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);
  return null;
}
