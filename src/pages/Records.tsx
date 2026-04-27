/**
 * Tela de medições cardíacas.
 *
 * Tem 3 partes:
 *   1. Lista de medições do usuário (do mais recente para o mais antigo)
 *   2. Botão FAB que abre um modal com o RecordForm pra criar nova medição
 *   3. Pull-to-refresh para recarregar a lista
 *
 * Estados de carregamento, erro e lista vazia são tratados explicitamente
 * para deixar a UX clara.
 */

import { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { add, close } from 'ionicons/icons';

import { extractErrorMessage } from '../lib/api';
import { criarRegistro, listarRegistros } from '../records/api';
import { RecordCard } from '../records/RecordCard';
import { RecordForm } from '../records/RecordForm';
import type { RegistroRequest, RegistroResponse } from '../records/types';

export function Records() {
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Busca a lista de medições do backend e atualiza o estado.
   * Aceita um callback opcional para sinalizar fim ao IonRefresher.
   */
  const carregar = async (onComplete?: () => void) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listarRegistros({ limite: 100 });
      setRegistros(data);
    } catch (err) {
      setLoadError(extractErrorMessage(err));
    } finally {
      setLoading(false);
      onComplete?.();
    }
  };

  useEffect(() => {
    void carregar();
  }, []);

  // Recarrega sempre que o usuário volta para a aba (ex: após criar
  // uma medição em outra tela). useIonViewWillEnter é o hook do Ionic
  // equivalente a "componentWillEnter" (specific to tab navigation).
  useIonViewWillEnter(() => {
    void carregar();
  });

  const handleCriar = async (payload: RegistroRequest) => {
    setSubmitError(null);
    try {
      await criarRegistro(payload);
      setModalAberto(false);
      await carregar();
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
      // Mantém o modal aberto em caso de erro para o usuário corrigir.
      throw err;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registros</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={(event) => {
            void carregar(() => event.detail.complete());
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        {loading && registros.length === 0 && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        )}

        {loadError && (
          <div className="ion-padding">
            <IonText color="danger">
              <p>{loadError}</p>
            </IonText>
            <IonButton expand="block" fill="outline" onClick={() => void carregar()}>
              Tentar novamente
            </IonButton>
          </div>
        )}

        {!loading && !loadError && registros.length === 0 && (
          <div className="ion-padding ion-text-center">
            <IonText color="medium">
              <h3>Sem medições ainda</h3>
              <p>
                Toque no botão <strong>+</strong> para registrar sua primeira
                medição cardíaca.
              </p>
            </IonText>
          </div>
        )}

        {registros.map((r) => (
          <RecordCard key={r.id} registro={r} />
        ))}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setModalAberto(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={modalAberto} onDidDismiss={() => setModalAberto(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Nova medição</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setModalAberto(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <RecordForm onSubmit={handleCriar} submitError={submitError} />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
