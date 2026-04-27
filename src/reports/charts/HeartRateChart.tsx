/**
 * Gráfico de linha da frequência cardíaca ao longo do tempo.
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

export function HeartRateChart({ registros }: Props) {
  const ordenados = [...registros].reverse();

  const data = {
    labels: ordenados.map((r) => formatLabel(r.dataHora)),
    datasets: [
      {
        label: 'Frequência (bpm)',
        data: ordenados.map((r) => r.frequenciaCardiaca),
        borderColor: 'rgb(69, 123, 157)',
        backgroundColor: 'rgba(69, 123, 157, 0.3)',
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Frequência cardíaca ao longo do tempo' },
    },
    scales: { y: { beginAtZero: false } },
  };

  return <Line data={data} options={options} />;
}
