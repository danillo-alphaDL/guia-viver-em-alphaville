"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Dispara "engaged_read" uma vez, quando o leitor passa 60 s na página e rola ao menos metade dela. */
export function LeituraEngajada({ slug, pilar }: { slug: string; pilar: string }) {
  useEffect(() => {
    let tempo = false;
    let rolou = false;
    let enviado = false;
    const tenta = () => {
      if (tempo && rolou && !enviado) {
        enviado = true;
        track("engaged_read", { slug, cluster: pilar });
      }
    };
    const t = setTimeout(() => {
      tempo = true;
      tenta();
    }, 60_000);
    const aoRolar = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= 0.5) {
        rolou = true;
        tenta();
      }
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", aoRolar);
    };
  }, [slug, pilar]);
  return null;
}
