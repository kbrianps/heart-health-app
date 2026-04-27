/**
 * Cliente HTTP centralizado.
 *
 * Cria uma instância única do axios apontando para a API definida em
 * env.apiUrl. Toda requisição passa pelo interceptor de request, que
 * adiciona o header Authorization com o token salvo em storage.
 *
 * O interceptor de response captura erros 401 (token inválido ou
 * expirado), limpa o storage e dispara um evento global `auth:logout`.
 * O AuthContext escuta esse evento para forçar redirect para a tela
 * de login.
 *
 * O tipo ApiError espelha o formato de erro padronizado do backend:
 *   { codigo: number, mensagem: string, detalhes?: string[] }
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

import { env } from './env';
import { storage } from './storage';

export interface ApiError {
  codigo: number;
  mensagem: string;
  detalhes?: string[];
}

export const AUTH_LOGOUT_EVENT = 'auth:logout';

const PUBLIC_PATHS = ['/login', '/usuarios'];

function isPublicPath(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_PATHS.some((path) => url.startsWith(path));
}

export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  if (!isPublicPath(config.url)) {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      await storage.clearToken();
      window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  },
);

/**
 * Extrai uma mensagem amigável de um erro do axios, lendo o corpo
 * padronizado da API quando existir, ou caindo para mensagem genérica.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.mensagem) {
      if (data.detalhes && data.detalhes.length > 0) {
        return `${data.mensagem}: ${data.detalhes.join(', ')}`;
      }
      return data.mensagem;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Erro inesperado';
}
