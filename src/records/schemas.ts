/**
 * Schemas zod do módulo de registros.
 *
 * Espelham as validações do backend para que o usuário receba feedback
 * imediato sem precisar fazer round-trip. Ranges idênticos aos do
 * Marshmallow no backend.
 */

import { z } from 'zod';

export const SINTOMAS_COMUNS = [
  'falta de ar',
  'dor no peito',
  'tontura',
  'palpitação',
  'fadiga',
  'cansaço',
  'náusea',
] as const;

export const recordFormSchema = z.object({
  sistolica: z
    .number({ message: 'Informe a pressão sistólica' })
    .int()
    .min(50, { message: 'Sistólica deve ser >= 50' })
    .max(250, { message: 'Sistólica deve ser <= 250' }),
  diastolica: z
    .number({ message: 'Informe a pressão diastólica' })
    .int()
    .min(30, { message: 'Diastólica deve ser >= 30' })
    .max(150, { message: 'Diastólica deve ser <= 150' }),
  frequenciaCardiaca: z
    .number({ message: 'Informe a frequência cardíaca' })
    .int()
    .min(30, { message: 'Frequência deve ser >= 30 bpm' })
    .max(220, { message: 'Frequência deve ser <= 220 bpm' }),
  oxigenacao: z
    .number({ message: 'Informe a oxigenação' })
    .int()
    .min(50, { message: 'Oxigenação deve ser >= 50%' })
    .max(100, { message: 'Oxigenação deve ser <= 100%' }),
  pesoCorporal: z
    .number({ message: 'Informe o peso' })
    .min(20, { message: 'Peso deve ser >= 20 kg' })
    .max(400, { message: 'Peso deve ser <= 400 kg' }),
  sintomas: z.array(z.string()),
});

export type RecordFormValues = z.infer<typeof recordFormSchema>;
