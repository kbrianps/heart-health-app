/**
 * Tipos do módulo de relatórios.
 * Espelham o contrato do backend (GET /api/relatorios).
 */

export interface RelatorioPeriodo {
  inicio: string; // YYYY-MM-DD
  fim: string;
}

export interface RelatorioMedias {
  pressaoSistolica: number;
  pressaoDiastolica: number;
  frequenciaCardiaca: number;
  oxigenacao: number;
  pesoCorporal: number;
}

export interface RelatorioResponse {
  periodo: RelatorioPeriodo;
  medias: RelatorioMedias;
  sintomasMaisFrequentes: string[];
  alertas: string[];
}
