export function JsonLd({ dados }: { dados: object | null | (object | null)[] }) {
  const lista = (Array.isArray(dados) ? dados : [dados]).filter(Boolean);
  if (!lista.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(lista.length === 1 ? lista[0] : lista).replace(/</g, "\\u003c") }}
    />
  );
}
