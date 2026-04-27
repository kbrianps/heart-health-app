/**
 * Painel dos sintomas mais frequentes no período.
 *
 * Vem do backend já em ordem decrescente de frequência (top 3).
 * Aqui exibimos como chips com tamanhos iguais — o backend não envia
 * a contagem, só os 3 nomes mais reportados.
 */

import { IonChip, IonLabel, IonList, IonListHeader, IonText } from '@ionic/react';

interface Props {
  sintomas: string[];
}

export function SymptomsPanel({ sintomas }: Props) {
  return (
    <IonList>
      <IonListHeader>
        <IonLabel>Sintomas mais frequentes</IonLabel>
      </IonListHeader>
      <div className="ion-padding-start ion-padding-end ion-padding-bottom">
        {sintomas.length === 0 ? (
          <IonText color="medium">
            <p>Nenhum sintoma reportado no período.</p>
          </IonText>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {sintomas.map((s, idx) => (
              <IonChip key={s} color={idx === 0 ? 'primary' : 'medium'}>
                <IonLabel>{s}</IonLabel>
              </IonChip>
            ))}
          </div>
        )}
      </div>
    </IonList>
  );
}
