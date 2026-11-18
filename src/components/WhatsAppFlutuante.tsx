"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { chamadaPara, type MapaContextos } from "@/lib/contexto-whatsapp";
import { track } from "@/lib/track";

const CHAVE_FECHADA = "gva-barra-wa-fechada";

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.004 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.257.59 4.454 1.71 6.395L3.2 28.8l6.57-1.72A12.74 12.74 0 0 0 16 28.668h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.053A12.72 12.72 0 0 0 16.004 3.2Zm0 23.04h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.003 1.05 1.07-3.902-.252-.4a10.57 10.57 0 0 1-1.62-5.645c0-5.86 4.77-10.63 10.6-10.63 2.834 0 5.497 1.104 7.5 3.11a10.53 10.53 0 0 1 3.106 7.53c0 5.86-4.77 10.597-10.6 10.597Zm5.82-7.94c-.32-.16-1.888-.93-2.18-1.037-.293-.106-.506-.16-.72.16-.213.32-.826 1.036-1.013 1.25-.187.213-.373.24-.693.08-.32-.16-1.35-.497-2.57-1.585-.95-.847-1.592-1.894-1.778-2.214-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.736-.986-2.376-.26-.622-.523-.538-.72-.548l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.256 3.446 5.466 4.83.764.33 1.36.527 1.825.674.767.244 1.464.21 2.016.127.615-.092 1.888-.772 2.154-1.518.266-.746.266-1.386.187-1.518-.08-.133-.293-.213-.613-.373Z"
      />
    </svg>
  );
}

/**
 * Botão flutuante e barra de rodapé do WhatsApp da Alpha DL, com texto e mensagem da página
 * (lib/contexto-whatsapp.ts). A barra surge depois que a pessoa rolou além da capa, some quando o
 * rodapé aparece e, fechada, não volta na mesma visita.
 *
 * Eventos (GA4): whatsapp_click com cta_id "flutuante" ou "barra" e page_type; cta_view quando a
 * barra aparece (uma vez por página); cta_dismiss quando é fechada.
 */
export function WhatsAppFlutuante({ numero, mapa }: { numero: string; mapa: MapaContextos }) {
  const caminho = usePathname() || "/";
  const chamada = useMemo(() => chamadaPara(caminho, mapa), [caminho, mapa]);
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(chamada.mensagem)}`;

  const [rolou, setRolou] = useState(false);
  const [rodapeVisivel, setRodapeVisivel] = useState(false);
  const [fechada, setFechada] = useState(true); // começa fechada: só abre depois de ler a sessão no cliente
  const vista = useRef<string | null>(null);

  useEffect(() => {
    try {
      setFechada(sessionStorage.getItem(CHAVE_FECHADA) === "1");
    } catch {
      setFechada(false);
    }
  }, []);

  useEffect(() => {
    const medir = () => setRolou(window.scrollY > window.innerHeight * 0.6);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, [caminho]);

  useEffect(() => {
    const rodape = document.querySelector(".rodape");
    if (!rodape || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => setRodapeVisivel(e.isIntersecting), { rootMargin: "0px 0px -40px 0px" });
    obs.observe(rodape);
    return () => obs.disconnect();
  }, [caminho]);

  const mostrarBarra = !chamada.semBarra && !fechada && rolou && !rodapeVisivel;

  useEffect(() => {
    if (mostrarBarra && vista.current !== caminho) {
      vista.current = caminho;
      track("cta_view", { cta_id: "barra", page_type: chamada.tipo });
    }
  }, [mostrarBarra, caminho, chamada.tipo]);

  if (!numero) return null;

  function fechar() {
    setFechada(true);
    try {
      sessionStorage.setItem(CHAVE_FECHADA, "1");
    } catch {}
    track("cta_dismiss", { cta_id: "barra", page_type: chamada.tipo });
  }

  return (
    <>
      <a
        className={`wa-flutuante${mostrarBarra ? " com-barra" : ""}`}
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp com a Alpha DL"
        data-rastreado=""
        onClick={() => track("whatsapp_click", { cta_id: "flutuante", page_type: chamada.tipo })}
      >
        <IconeWhatsApp />
      </a>

      <div className={`barra-wa${mostrarBarra ? " visivel" : ""}`} role="region" aria-label="Falar com a Alpha DL" aria-hidden={!mostrarBarra} inert={!mostrarBarra}>
        <div className="barra-wa-txt">
          <strong>{chamada.titulo}</strong>
          <span>{chamada.apoio}</span>
        </div>
        <a
          className="barra-wa-botao"
          href={href}
          target="_blank"
          rel="noopener"
          data-rastreado=""
          onClick={() => track("whatsapp_click", { cta_id: "barra", page_type: chamada.tipo })}
        >
          <IconeWhatsApp />
          {chamada.botao}
        </a>
        <button type="button" className="barra-wa-fechar" aria-label="Fechar" data-rastreado="" onClick={fechar}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </>
  );
}
