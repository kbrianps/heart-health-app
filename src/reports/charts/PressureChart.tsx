/**
 * Gráfico de linha das pressões sistólica e diastólica ao longo do
 * tempo, com base nos registros do período.
 *
 * Recebe array de RegistroResponse e plota duas séries (uma para cada
 * pressão). Eixo X é a data formatada (dia/mês), eixo Y é a pressão
 * em mmHg.
 */

import { Line } from 'react-chartjs-2';

import type { RegistroResponse } from '../../records/types';
import './setup';

interface Props {
  registros: RegistroResponse[];
}

function formatLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function PressureChart({ registros }: Props) {
  // O backend devolve do mais recente para o mais antigo. Pra gráfico
  // queremos ordem cronológica crescente, então invertemos.
  const ordenados = [...registros].reverse();

  const data = {
    labels: ordenados.map((r) => formatLabel(r.dataHora)),
    datasets: [
      {
        label: 'Sistólica (mmHg)',
        data: ordenados.map((r) => r.pressaoArterial.sistolica),
        borderColor: 'rgb(230, 57, 70)',
        backgroundColor: 'rgba(230, 57, 70, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Diastólica (mmHg)',
        data: ordenados.map((r) => r.pressaoArterial.diastolica),
        borderColor: 'rgb(29, 53, 87)',
        backgroundColor: 'rgba(29, 53, 87, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Pressão arterial ao longo do tempo' },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return <Line data={data} options={options} />;
}
