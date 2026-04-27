/**
 * Componente raiz do app.
 *
 * Envolve todas as rotas com o AuthProvider, monta o IonReactRouter e
 * define quais rotas são públicas (login, register) e quais ficam atrás
 * do PrivateRoute (todas as `/tabs/*`).
 *
 * O Redirect na raiz aponta para `/tabs/records` (a área autenticada
 * default). Se o usuário não estiver autenticado, o PrivateRoute devolve
 * outro redirect para `/login`.
 */

import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { TabsLayout } from './components/TabsLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode (segue o sistema) */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables (paleta cardíaca) */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthProvider>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>

          <PrivateRoute path="/tabs">
            <TabsLayout />
          </PrivateRoute>

          <Route exact path="/">
            <Redirect to="/tabs/records" />
          </Route>
        </IonRouterOutlet>
      </AuthProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
