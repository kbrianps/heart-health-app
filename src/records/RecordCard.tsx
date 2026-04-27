/**
 * Card de uma medição cardíaca individual.
 *
 * Exibe data formatada, pressão arterial em formato compacto
 * (ex: 120/80), frequência, oxigenação, peso e chips com sintomas
 * relatados. Pensado para ser usado dentro de uma IonList.
 */

import {
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonLabel,
  IonText,
} from '@ionic/react';
import { fitness, heart, scale, water } from 'ionicons/icons';

import type { RegistroResponse } from './types';

interface Props {
  registro: RegistroResponse;
}

/**
 * Formata uma string ISO 8601 em data e hora local
 * (ex: "27/04/2026 14:30").
 */
function formatarData(iso: string): string {
  try {
    const data = new Date(iso);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function RecordCard({ registro }: Props) {
  const { dataHora, pressaoArterial, frequenciaCardiaca, oxigenacao, pesoCorporal, sintomas } =
    registro;

  return (
    <IonCard>
      <IonCardContent>
        <IonText color="medium">
          <small>{formatarData(dataHora)}</small>
        </IonText>

        <div className="ion-margin-top" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <IonChip color="primary">
            <IonIcon icon={heart} />
            <IonLabel>
              {pressaoArterial.sistolica}/{pressaoArterial.diastolica} mmHg
            </IonLabel>
          </IonChip>

          <IonChip color="secondary">
            <IonIcon icon={fitness} />
            <IonLabel>{frequenciaCardiaca} bpm</IonLabel>
          </IonChip>

          <IonChip color="tertiary">
            <IonIcon icon={water} />
            <IonLabel>{oxigenacao}%</IonLabel>
          </IonChip>

          <IonChip>
            <IonIcon icon={scale} />
            <IonLabel>{pesoCorporal} kg</IonLabel>
          </IonChip>
        </div>

        {sintomas.length > 0 && (
          <div className="ion-margin-top">
            <IonText color="medium">
              <small>Sintomas relatados</small>
            </IonText>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
              {sintomas.map((s) => (
                <IonChip key={s} color="warning" outline>
                  <IonLabel>{s}</IonLabel>
                </IonChip>
              ))}
            </div>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}
