/**
 * Wrapper sobre @capacitor/preferences para persistência de dados leves.
 *
 * O Capacitor Preferences usa SharedPreferences no Android e
 * UserDefaults no iOS. No web, ele cai pra localStorage.
 *
 * Aqui guardamos só o token JWT, mas o módulo é genérico o suficiente
 * para usos futuros (preferências do usuário, último filtro, etc).
 */

import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'auth_token';

export const storage = {
  setToken: async (token: string): Promise<void> => {
    await Preferences.set({ key: TOKEN_KEY, value: token });
  },

  getToken: async (): Promise<string | null> => {
    const result = await Preferences.get({ key: TOKEN_KEY });
    return result.value;
  },

  clearToken: async (): Promise<void> => {
    await Preferences.remove({ key: TOKEN_KEY });
  },
};
