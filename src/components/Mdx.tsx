import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";

function Nota({ children }: { children: React.ReactNode }) {
  return <aside className="nota-texto">{children}</aside>;
}

/** Marcação editorial para trecho que ainda depende de apuração. Bloqueia publicação no checador. */
function Apurar({ children }: { children: React.ReactNode }) {
  return <mark className="apurar">[A apurar: {children}]</mark>;
}

export const ancora = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function textoDe(n: React.ReactNode): string {
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(textoDe).join("");
  if (n && typeof n === "object" && "props" in n) return textoDe((n as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

const componentes = {
  h2: ({ children }: { children?: React.ReactNode }) => <h2 id={ancora(textoDe(children))}>{children}</h2>,
  Nota,
  Apurar,
  a: ({ href = "", children }: { href?: string; children?: React.ReactNode }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  table: (p: React.ComponentProps<"table">) => (
    <div className="tabela-box">
      <table {...p} />
    </div>
  ),
};

export async function Mdx({ fonte }: { fonte: string }) {
  const { content } = await compileMDX({ source: fonte, components: componentes, options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } } });
  return content;
}
