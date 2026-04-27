/**
 * Tela de medições cardíacas (placeholder).
 * A implementação completa vem na próxima fase do plano.
 */

import {
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

export function Records() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registros</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Em breve</h2>
          <p>
            Aqui serão listadas suas medições cardíacas e haverá um botão
            para registrar novas. Funcionalidade completa será adicionada
            na próxima fase do projeto.
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}
