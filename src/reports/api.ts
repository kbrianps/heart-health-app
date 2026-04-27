/**
 * Cliente HTTP do módulo de relatórios.
 *
 * Encapsula a chamada GET /api/relatorios. Os dois parâmetros são
 * obrigatórios no backend (dataInicio e dataFim).
 */

import { api } from '../lib/api';
import type { RelatorioResponse } from './types';

export async function gerarRelatorio(
  dataInicio: string,
  dataFim: string,
): Promise<RelatorioResponse> {
  const response = await api.get<RelatorioResponse>('/relatorios', {
    params: { dataInicio, dataFim },
  });
  return response.data;
}
