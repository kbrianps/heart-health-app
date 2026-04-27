/**
 * Definição do React Context de autenticação.
 *
 * Fica em arquivo separado do Provider e do hook para permitir Fast
 * Refresh do Vite/React funcionar corretamente: arquivos que misturam
 * componentes e exports não-componente quebram o refresh em
 * desenvolvimento.
 */

import { createContext } from 'react';

import type { AuthUser, RegisterRequest } from './types';

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
