/**
 * Wrapper de Route que redireciona para /login se o usuário não está
 * autenticado. Enquanto o AuthContext está restaurando o token do
 * storage, exibe nada (rápido o suficiente para não precisar spinner).
 */

import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from './AuthContext';

export function PrivateRoute(props: RouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}
