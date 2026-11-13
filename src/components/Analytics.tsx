"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CHAVE = "gva-consentimento";

function lerConsentimento(): "aceito" | "recusado" | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

function aplicar(aceito: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: aceito ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function Analytics({ gaId }: { gaId: string }) {
  const [pendente, setPendente] = useState(false);

  useEffect(() => {
    const c = lerConsentimento();
    if (c) aplicar(c === "aceito");
    else setPendente(true);
  }, []);

  function decidir(aceito: boolean) {
    try {
      localStorage.setItem(CHAVE, aceito ? "aceito" : "recusado");
    } catch {}
    aplicar(aceito);
    setPendente(false);
  }

  if (!gaId) return null;
  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      `}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      {pendente && (
        <div className="consentimento" role="dialog" aria-live="polite" aria-label="Preferências de privacidade">
          <p>
            Usamos cookies de medição para entender quais conteúdos ajudam mais. Nada de publicidade.{" "}
            <a href="/privacidade">Política de privacidade</a>
          </p>
          <div>
            <button type="button" className="btn" onClick={() => decidir(false)}>
              Recusar
            </button>
            <button type="button" className="btn cheio" onClick={() => decidir(true)}>
              Aceitar medição
            </button>
          </div>
        </div>
      )}
    </>
  );
}
