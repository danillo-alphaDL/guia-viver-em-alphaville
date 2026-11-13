import { Migalha } from "./Migalha";

export function PaginaSimples({ rotulo, titulo, lead, caminho, pai, children }: { rotulo?: string; titulo: string; lead?: string; caminho: string; pai?: { nome: string; caminho: string }; children: React.ReactNode }) {
  return (
    <>
      <section className="pg-simples">
        <div className="wrap">
          <Migalha itens={[...(pai ? [pai] : []), { nome: rotulo ?? titulo, caminho }]} />
          <h1>{titulo}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
      </section>
      <div className="claro">
        <div className="wrap" style={{ paddingBlock: "64px 104px" }}>
          {children}
        </div>
      </div>
    </>
  );
}
