import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { ldBreadcrumb } from "@/lib/seo";

export function Migalha({ itens }: { itens: { nome: string; caminho: string }[] }) {
  const todos = [{ nome: "Início", caminho: "/" }, ...itens];
  return (
    <>
      <nav className="migalha" aria-label="Trilha de navegação">
        <ol>
          {todos.map((i, n) => (
            <li key={i.caminho}>
              {n < todos.length - 1 ? <Link href={i.caminho}>{i.nome}</Link> : <span aria-current="page">{i.nome}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd dados={ldBreadcrumb(todos)} />
    </>
  );
}
