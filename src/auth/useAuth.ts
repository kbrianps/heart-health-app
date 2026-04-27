/**
 * Hook que expõe o AuthContext para os componentes.
 *
 * Mantido em arquivo separado do Provider para permitir Fast Refresh
 * do Vite/React: arquivos que misturam componentes e funções utilitárias
 * "quebram" o refresh, então separamos.
 */

import { useContext } from 'react';

import { AuthContext, type AuthContextValue } from './context';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
