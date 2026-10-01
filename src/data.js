export const month = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
}).format(new Date());

export const prizeByPosition = {
  1: 300,
  2: 200,
  3: 100,
};

/**
 * Ranking demonstrativo para preservar o visual enquanto ainda não há dados reais.
 * Os nomes e números abaixo são fictícios e podem ser substituídos pelo backend depois.
 */
export const influencers = [
  { id: 1, name: "Ruan Tavares César", totalViews: 5094 },
  { id: 2, name: "Guilherme Mota da Silva", totalViews: 2117 },
  { id: 3, name: "Marcio Guilherme Gusmão Macedo", totalViews: 984 },
  { id: 4, name: "Eric Jesus de Oliveira Castro", totalViews: 730 },
  { id: 5, name: "Adrian Jotemberg Lopes da Silva", totalViews: 612 },
  { id: 6, name: "Beatriz Lima Ferreira", totalViews: 498 },
  { id: 7, name: "Lucas Rocha Mendes", totalViews: 376 },
];

/**
 * Sem clipes reais por enquanto.
 * Quando houver backend, essa lista será preenchida pelos envios do usuário.
 */
export const myClips = [];
