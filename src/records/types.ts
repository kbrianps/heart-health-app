/**
 * Tipos do módulo de registros (medições cardíacas).
 *
 * Espelham o contrato OpenAPI do backend (POST/GET /api/registros).
 * As chaves estão em camelCase em português, do jeito que a API entrega
 * e consome, evitando conversões na camada de UI.
 */

export interface PressaoArterial {
  sistolica: number;
  diastolica: number;
}

/**
 * Payload enviado para criar uma medição.
 */
export interface RegistroRequest {
  pressaoArterial: PressaoArterial;
  frequenciaCardiaca: number;
  oxigenacao: number;
  pesoCorporal: number;
  sintomas?: string[];
}

/**
 * Resposta de uma medição cadastrada (também o item da listagem).
 */
export interface RegistroResponse {
  id: number;
  dataHora: string; // ISO 8601
  pressaoArterial: PressaoArterial;
  frequenciaCardiaca: number;
  oxigenacao: number;
  pesoCorporal: number;
  sintomas: string[];
}

/**
 * Filtros aceitos pela listagem GET /api/registros.
 * Todos opcionais.
 */
export interface ListarRegistrosFiltros {
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string;
  limite?: number;
}
