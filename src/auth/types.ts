/**
 * Tipos compartilhados do módulo de autenticação.
 * Espelham o contrato OpenAPI do backend.
 */

export interface AuthUser {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse extends AuthUser {
  token: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  dataNascimento: string; // YYYY-MM-DD
  sexo: 'masculino' | 'feminino' | 'outro';
  pais: string;
}

export interface RegisterResponse {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
}
