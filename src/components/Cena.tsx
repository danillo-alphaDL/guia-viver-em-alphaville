import Image from "next/image";
import { useId } from "react";
import { svgCena, VIEWBOX } from "@/lib/cena";

type Props = {
  nome: string;
  className?: string;
  style?: React.CSSProperties;
  /** Fotografia licenciada. Quando existir, substitui a ilustração. */
  foto?: { src: string; alt: string; prioridade?: boolean };
  credito?: boolean;
  children?: React.ReactNode;
};

export function Cena({ nome, className, style, foto, credito = true, children }: Props) {
  const id = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={`cena ${className ?? ""}`} style={style}>
      {foto ? (
        <Image src={foto.src} alt={foto.alt} fill sizes="100vw" priority={foto.prioridade} style={{ objectFit: "cover" }} />
      ) : (
        <>
          <svg viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: svgCena(nome, id) }} />
          {credito && <span className="credito">Ilustração conceitual</span>}
        </>
      )}
      {children}
    </div>
  );
}
