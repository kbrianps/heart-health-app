/**
 * Gráfico de linha do peso corporal ao longo do tempo.
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

export function WeightChart({ registros }: Props) {
  const ordenados = [...registros].reverse();

  const data = {
    labels: ordenados.map((r) => formatLabel(r.dataHora)),
    datasets: [
      {
        label: 'Peso (kg)',
        data: ordenados.map((r) => r.pesoCorporal),
        borderColor: 'rgb(29, 53, 87)',
        backgroundColor: 'rgba(29, 53, 87, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Peso corporal ao longo do tempo' },
    },
    scales: { y: { beginAtZero: false } },
  };

  return <Line data={data} options={options} />;
}
