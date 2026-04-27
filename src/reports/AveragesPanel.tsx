/**
 * Painel com as médias dos 5 indicadores no período.
 *
 * Cada indicador vira um card pequeno com label e valor formatado.
 * Layout em grid responsivo do Ionic (IonGrid).
 */

import {
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';

import type { RelatorioMedias } from './types';

interface Props {
  medias: RelatorioMedias;
}

export function AveragesPanel({ medias }: Props) {
  const cards = [
    {
      titulo: 'Pressão sistólica',
      valor: `${medias.pressaoSistolica}`,
      unidade: 'mmHg',
    },
    {
      titulo: 'Pressão diastólica',
      valor: `${medias.pressaoDiastolica}`,
      unidade: 'mmHg',
    },
    {
      titulo: 'Frequência cardíaca',
      valor: `${medias.frequenciaCardiaca}`,
      unidade: 'bpm',
    },
    {
      titulo: 'Oxigenação',
      valor: `${medias.oxigenacao}`,
      unidade: '%',
    },
    {
      titulo: 'Peso corporal',
      valor: `${medias.pesoCorporal}`,
      unidade: 'kg',
    },
  ];

  return (
    <IonGrid>
      <IonRow>
        {cards.map((card) => (
          <IonCol key={card.titulo} size="6" sizeMd="4">
            <IonCard>
              <IonCardContent>
                <IonCardSubtitle>{card.titulo}</IonCardSubtitle>
                <IonCardTitle>
                  {card.valor} <small style={{ fontSize: '0.6em' }}>{card.unidade}</small>
                </IonCardTitle>
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
}
