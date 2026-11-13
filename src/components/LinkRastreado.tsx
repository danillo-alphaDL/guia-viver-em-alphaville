"use client";

import { track, type Evento } from "@/lib/track";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { evento?: Evento; ctaId: string };

/** Link com evento de analytics. Links externos abrem em nova aba com rel seguro. */
export function LinkRastreado({ evento = "cta_click", ctaId, href = "", children, ...resto }: Props) {
  const externo = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener" } : {})}
      {...resto}
      onClick={() => track(evento, { cta_id: ctaId, destination: href.split("?")[0] })}
    >
      {children}
    </a>
  );
}
