/**
 * Tela de relatório consolidado de saúde cardíaca.
 *
 * O usuário escolhe um período (datas inicial e final). Por padrão,
 * carregamos os últimos 30 dias automaticamente. Ao clicar "Gerar
 * relatório", duas chamadas paralelas:
 *   1. GET /api/relatorios — médias, sintomas mais frequentes e alertas
 *   2. GET /api/registros (mesmo período) — dados crus para alimentar
 *      os gráficos de evolução
 *
 * Ambos os payloads alimentam três blocos visuais: AveragesPanel,
 * SymptomsPanel + AlertsPanel, e os 3 gráficos de linha.
 *
 * Se a API retornar 404 (período sem dados), exibimos mensagem amigável
 * em vez de erro.
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { extractErrorMessage } from '../lib/api';
import { listarRegistros } from '../records/api';
import type { RegistroResponse } from '../records/types';
import { AlertsPanel } from '../reports/AlertsPanel';
import { AveragesPanel } from '../reports/AveragesPanel';
import { SymptomsPanel } from '../reports/SymptomsPanel';
import { gerarRelatorio } from '../reports/api';
import { HeartRateChart } from '../reports/charts/HeartRateChart';
import { PressureChart } from '../reports/charts/PressureChart';
import { WeightChart } from '../reports/charts/WeightChart';
import type { RelatorioResponse } from '../reports/types';

/**
 * Devolve a string YYYY-MM-DD de uma data, no fuso local.
 */
function toIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function Reports() {
  // Default: últimos 30 dias
  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);

  const [dataInicio, setDataInicio] = useState<string>(toIsoDate(trintaDiasAtras));
  const [dataFim, setDataFim] = useState<string>(toIsoDate(hoje));

  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [semDados, setSemDados] = useState(false);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    setSemDados(false);
    try {
      // Promises paralelas: relatório + lista de registros do período
      const [rel, regs] = await Promise.all([
        gerarRelatorio(dataInicio, dataFim),
        listarRegistros({ dataInicio, dataFim, limite: 100 }),
      ]);
      setRelatorio(rel);
      setRegistros(regs);
    } catch (err) {
      // 404 do /relatorios = período sem dados, tratamos como caso "vazio"
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setRelatorio(null);
        setRegistros([]);
        setSemDados(true);
      } else {
        setError(extractErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Carrega automaticamente ao abrir a tela com o período default
  useEffect(() => {
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Relatórios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Início</IonLabel>
          <IonInput
            type="date"
            value={dataInicio}
            onIonInput={(e) => setDataInicio(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Fim</IonLabel>
          <IonInput
            type="date"
            value={dataFim}
            onIonInput={(e) => setDataFim(e.detail.value ?? '')}
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          disabled={loading}
          onClick={() => void carregar()}
        >
          {loading ? 'Gerando...' : 'Gerar relatório'}
        </IonButton>

        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p className="ion-padding">{error}</p>
          </IonText>
        )}

        {semDados && (
          <div className="ion-padding ion-text-center">
            <IonText color="medium">
              <h3>Sem dados no período</h3>
              <p>
                Nenhuma medição foi encontrada entre {dataInicio} e {dataFim}.
                Cadastre algumas medições na aba <strong>Registros</strong>{' '}
                ou amplie o período.
              </p>
            </IonText>
          </div>
        )}

        {relatorio && !loading && (
          <>
            <AveragesPanel medias={relatorio.medias} />
            <SymptomsPanel sintomas={relatorio.sintomasMaisFrequentes} />
            <AlertsPanel alertas={relatorio.alertas} />

            {registros.length >= 2 && (
              <div className="ion-padding-top">
                <div className="ion-margin-bottom">
                  <PressureChart registros={registros} />
                </div>
                <div className="ion-margin-bottom">
                  <HeartRateChart registros={registros} />
                </div>
                <div className="ion-margin-bottom">
                  <WeightChart registros={registros} />
                </div>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
