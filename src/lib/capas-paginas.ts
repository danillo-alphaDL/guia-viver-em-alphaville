import type { StaticImageData } from "next/image";
import casaPiscina from "../../public/capas/casa-piscina.webp";
import aereaCidade from "../../public/capas/aerea-cidade.webp";
import aereaLago from "../../public/capas/aerea-lago.webp";
import type { Pilar } from "./site";

/**
 * Capas fotográficas das páginas principais (home e pilares).
 * `pos` é o ponto de foco no computador; `posMovel`, no celular, onde a foto vira uma faixa vertical.
 * Para trocar a capa de uma página, troque a imagem aqui (roteiro de arte em docs/06-capas-das-paginas.md).
 */
export type CapaPagina = { src: StaticImageData; alt: string; pos: string; posMovel: string };

const casa = { src: casaPiscina, alt: "Casa contemporânea de alto padrão com piscina e jardim tropical" };
const lago = { src: aereaLago, alt: "Vista aérea de residencial com lago, campo de golfe e casas ao pôr do sol" };
const cidade = { src: aereaCidade, alt: "Vista aérea de Alphaville ao entardecer, com lago e prédios ao fundo" };

export const CAPA_HOME: CapaPagina = { ...casa, pos: "62% 55%", posMovel: "58% 50%" };

export const CAPAS_PILARES: Record<Pilar, CapaPagina> = {
  comprar: { ...lago, pos: "50% 70%", posMovel: "42% 75%" },
  alugar: { ...casa, pos: "50% 75%", posMovel: "30% 70%" },
  condominios: { ...lago, pos: "60% 40%", posMovel: "70% 55%" },
  viver: { ...cidade, pos: "35% 60%", posMovel: "22% 62%" },
  mercado: { ...cidade, pos: "70% 35%", posMovel: "66% 35%" },
};
