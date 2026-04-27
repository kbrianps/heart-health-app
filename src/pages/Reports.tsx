/**
 * Tela de relatório de saúde cardíaca (placeholder).
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

export function Reports() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Relatórios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Em breve</h2>
          <p>
            Aqui você verá médias dos indicadores, sintomas mais frequentes
            e gráficos de evolução ao longo do tempo. Funcionalidade
            completa será adicionada na próxima fase do projeto.
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}
