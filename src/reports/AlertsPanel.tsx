/**
 * Painel de alertas do relatório.
 *
 * O backend gera mensagens textuais quando indicadores ficam fora dos
 * limites de referência (ex: "Pressão sistólica acima do ideal em 3
 * registros"). Aqui só renderizamos cada uma como item de lista com
 * ícone de alerta.
 *
 * Quando a lista está vazia, mostra mensagem amigável de "tudo dentro
 * dos limites".
 */

import { IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonText } from '@ionic/react';
import { checkmarkCircle, warning } from 'ionicons/icons';

interface Props {
  alertas: string[];
}

export function AlertsPanel({ alertas }: Props) {
  if (alertas.length === 0) {
    return (
      <IonList>
        <IonListHeader>
          <IonLabel>Alertas</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon icon={checkmarkCircle} color="success" slot="start" />
          <IonLabel>
            <IonText color="success">Tudo dentro dos limites de referência no período.</IonText>
          </IonLabel>
        </IonItem>
      </IonList>
    );
  }

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Alertas</IonLabel>
      </IonListHeader>
      {alertas.map((mensagem) => (
        <IonItem key={mensagem}>
          <IonIcon icon={warning} color="warning" slot="start" />
          <IonLabel className="ion-text-wrap">{mensagem}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
