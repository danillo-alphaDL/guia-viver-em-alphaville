export function AvisoRascunho({ status }: { status: string }) {
  return (
    <div className="aviso-rascunho" role="note">
      <div className="wrap">
        Rascunho em <strong>{status.replace(/-/g, " ")}</strong>. Visível só no ambiente de pré-visualização, fora do Google (noindex).
      </div>
    </div>
  );
}
