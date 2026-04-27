/**
 * Cliente HTTP do módulo de autenticação.
 *
 * Funções tipadas que chamam os endpoints públicos /login e /usuarios
 * do backend. Não anexam token (o interceptor do axios trata isso, mas
 * /login e /usuarios estão na lista de rotas públicas).
 */

import { api } from '../lib/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/login', payload);
  return response.data;
}

export async function registerUser(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/usuarios', payload);
  return response.data;
}
