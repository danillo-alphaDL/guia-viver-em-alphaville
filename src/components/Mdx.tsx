import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";

function Nota({ children }: { children: React.ReactNode }) {
  return <aside className="nota-texto">{children}</aside>;
}

/** Marcação editorial para trecho que ainda depende de apuração. Bloqueia publicação no checador. */
function Apurar({ children }: { children: React.ReactNode }) {
  return <mark className="apurar">[A apurar: {children}]</mark>;
}

const componentes = {
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
  const { content } = await compileMDX({ source: fonte, components: componentes, options: { parseFrontmatter: false } });
  return content;
}
