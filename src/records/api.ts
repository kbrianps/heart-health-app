/**
 * Cliente HTTP do módulo de registros.
 *
 * Encapsula as chamadas a POST /api/registros e GET /api/registros,
 * deixando os componentes da UI livres pra trabalhar só com Promises
 * tipadas.
 */

import { api } from '../lib/api';
import type {
  ListarRegistrosFiltros,
  RegistroRequest,
  RegistroResponse,
} from './types';

/**
 * Cria uma nova medição cardíaca para o usuário autenticado.
 */
export async function criarRegistro(
  payload: RegistroRequest,
): Promise<RegistroResponse> {
  const response = await api.post<RegistroResponse>('/registros', payload);
  return response.data;
}

/**
 * Lista as medições do usuário autenticado.
 *
 * Aceita filtros opcionais de data e limite. O backend ordena do mais
 * recente para o mais antigo.
 */
export async function listarRegistros(
  filtros: ListarRegistrosFiltros = {},
): Promise<RegistroResponse[]> {
  const params: Record<string, string | number> = {};
  if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) params.dataFim = filtros.dataFim;
  if (filtros.limite !== undefined) params.limite = filtros.limite;

  const response = await api.get<RegistroResponse[]>('/registros', { params });
  return response.data;
}
