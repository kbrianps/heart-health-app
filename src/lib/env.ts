/**
 * Centraliza a leitura de variáveis de ambiente injetadas pelo Vite.
 *
 * Vite expõe somente variáveis prefixadas com VITE_* via import.meta.env,
 * o que evita vazar segredos para o bundle do cliente. Em build de
 * produção, esses valores são substituídos em tempo de compilação.
 */

const FALLBACK_API_URL = 'https://heart-health-api.kbrianps.com/api';

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? FALLBACK_API_URL,
};
