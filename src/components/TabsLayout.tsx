/**
 * Layout principal da área autenticada do app.
 *
 * Usa IonTabs do Ionic React, montando 3 tabs no rodapé:
 *   - Registros (icone heart): tela de medições
 *   - Relatórios (icone analytics): tela de relatório
 *   - Sobre (icone people): equipe + logout
 *
 * As 3 rotas filhas são definidas como Routes dentro de IonRouterOutlet,
 * permitindo navegação independente em cada tab (com pilha própria).
 */

import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { analytics, heart, people } from 'ionicons/icons';

import { About } from '../pages/About';
import { Records } from '../pages/Records';
import { Reports } from '../pages/Reports';

export function TabsLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/records">
          <Records />
        </Route>
        <Route exact path="/tabs/reports">
          <Reports />
        </Route>
        <Route exact path="/tabs/about">
          <About />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/records" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="records" href="/tabs/records">
          <IonIcon icon={heart} />
          <IonLabel>Registros</IonLabel>
        </IonTabButton>
        <IonTabButton tab="reports" href="/tabs/reports">
          <IonIcon icon={analytics} />
          <IonLabel>Relatórios</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/tabs/about">
          <IonIcon icon={people} />
          <IonLabel>Sobre</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
