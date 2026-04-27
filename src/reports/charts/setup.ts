/**
 * Setup centralizado do Chart.js.
 *
 * O Chart.js v4 exige registro explícito dos componentes que serão
 * usados (tree-shaking). Aqui registramos só os componentes necessários
 * para gráficos de linha, mantendo o bundle final menor.
 *
 * Importar este módulo uma vez (em qualquer lugar) é suficiente — o
 * registro afeta toda a aplicação.
 */

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
