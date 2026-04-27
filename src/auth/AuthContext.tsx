/**
 * Contexto de autenticação da aplicação.
 *
 * Mantém o estado global do usuário logado e do token JWT, expondo
 * `login`, `register` e `logout` para qualquer componente.
 *
 * O Provider faz duas coisas no mount:
 *   1. Lê token salvo do storage e tenta restaurar a sessão
 *   2. Escuta o evento global `auth:logout` (disparado pelo interceptor
 *      do axios em respostas 401) para limpar o estado e redirecionar
 *
 * O usuário fica em memória após login/register. Em um refresh real do
 * app, sem chamada de "me", apenas o token persiste e o objeto `user`
 * fica nulo até o próximo login. Isso é aceitável para o escopo do
 * trabalho, já que o app vai redirecionar para /login se algum request
 * autenticado retornar 401.
 */

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AUTH_LOGOUT_EVENT } from '../lib/api';
import { storage } from '../lib/storage';
import * as authApi from './api';
import type { AuthUser, RegisterRequest } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = useCallback(async () => {
    await storage.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    storage.getToken().then((stored) => {
      if (mounted && stored) {
        setToken(stored);
      }
      if (mounted) {
        setLoading(false);
      }
    });

    const onLogout = () => {
      void handleLogout();
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);

    return () => {
      mounted = false;
      window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
    };
  }, [handleLogout]);

  const login = useCallback(async (email: string, senha: string) => {
    const data = await authApi.login({ email, senha });
    await storage.setToken(data.token);
    setToken(data.token);
    setUser({
      id: data.id,
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
    });
  }, []);

  const register = useCallback(
    async (payload: RegisterRequest) => {
      await authApi.registerUser(payload);
      // Após cadastro, faz login automático para o usuário não digitar de novo
      await login(payload.email, payload.senha);
    },
    [login],
  );

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isAuthenticated: token !== null,
    login,
    register,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
