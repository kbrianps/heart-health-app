/**
 * Form de criação de uma nova medição cardíaca.
 *
 * Validação client-side via zod (espelhando os ranges do backend)
 * com react-hook-form. Sintomas são apresentados como chips clicáveis
 * pré-definidos com os mais comuns; o usuário pode marcar múltiplos.
 *
 * O form é um componente reutilizável: pode ser usado dentro de uma
 * IonModal ou direto numa página. Ao submeter, chama o callback
 * `onSubmit` recebido por props com o payload já no formato esperado
 * pelo backend.
 */

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IonButton,
  IonChip,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonText,
} from '@ionic/react';

import { recordFormSchema, SINTOMAS_COMUNS, type RecordFormValues } from './schemas';
import type { RegistroRequest } from './types';

interface Props {
  onSubmit: (payload: RegistroRequest) => Promise<void>;
  submitError?: string | null;
}

export function RecordForm({ onSubmit, submitError }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      sistolica: 120,
      diastolica: 80,
      frequenciaCardiaca: 72,
      oxigenacao: 98,
      pesoCorporal: 70,
      sintomas: [],
    },
  });

  // Sintomas selecionados — usado pra desenhar os chips com cor de
  // "selecionado" (preenchido) ou "disponível" (outline).
  const sintomasSelecionados = watch('sintomas');

  const toggleSintoma = (sintoma: string) => {
    const atual = sintomasSelecionados ?? [];
    if (atual.includes(sintoma)) {
      setValue(
        'sintomas',
        atual.filter((s) => s !== sintoma),
      );
    } else {
      setValue('sintomas', [...atual, sintoma]);
    }
  };

  const enviar = async (values: RecordFormValues) => {
    setSubmitting(true);
    try {
      // Converte do formato plano (do form) para o aninhado (do backend).
      const payload: RegistroRequest = {
        pressaoArterial: {
          sistolica: values.sistolica,
          diastolica: values.diastolica,
        },
        frequenciaCardiaca: values.frequenciaCardiaca,
        oxigenacao: values.oxigenacao,
        pesoCorporal: values.pesoCorporal,
        sintomas: values.sintomas,
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Helper para campos numéricos: o IonInput emite string, mas o zod
   * espera number. Convertemos no onIonInput.
   */
  const numericInput = (name: keyof RecordFormValues, isFloat = false) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <IonInput
          type="number"
          inputmode={isFloat ? 'decimal' : 'numeric'}
          value={field.value as number}
          onIonInput={(e) => {
            const raw = e.detail.value ?? '';
            const parsed = isFloat ? parseFloat(raw) : parseInt(raw, 10);
            field.onChange(Number.isNaN(parsed) ? undefined : parsed);
          }}
        />
      )}
    />
  );

  return (
    <form onSubmit={handleSubmit(enviar)}>
      <IonList>
        <IonListHeader>
          <IonLabel>Pressão arterial (mmHg)</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonLabel position="stacked">Sistólica</IonLabel>
          {numericInput('sistolica')}
          {errors.sistolica && <IonNote color="danger">{errors.sistolica.message}</IonNote>}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Diastólica</IonLabel>
          {numericInput('diastolica')}
          {errors.diastolica && <IonNote color="danger">{errors.diastolica.message}</IonNote>}
        </IonItem>

        <IonListHeader>
          <IonLabel>Demais indicadores</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonLabel position="stacked">Frequência cardíaca (bpm)</IonLabel>
          {numericInput('frequenciaCardiaca')}
          {errors.frequenciaCardiaca && (
            <IonNote color="danger">{errors.frequenciaCardiaca.message}</IonNote>
          )}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Oxigenação (%)</IonLabel>
          {numericInput('oxigenacao')}
          {errors.oxigenacao && <IonNote color="danger">{errors.oxigenacao.message}</IonNote>}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Peso (kg)</IonLabel>
          {numericInput('pesoCorporal', true)}
          {errors.pesoCorporal && <IonNote color="danger">{errors.pesoCorporal.message}</IonNote>}
        </IonItem>

        <IonListHeader>
          <IonLabel>Sintomas (opcional)</IonLabel>
        </IonListHeader>

        <div className="ion-padding-start ion-padding-end" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {SINTOMAS_COMUNS.map((s) => {
            const selecionado = sintomasSelecionados.includes(s);
            return (
              <IonChip
                key={s}
                color={selecionado ? 'primary' : 'medium'}
                outline={!selecionado}
                onClick={() => toggleSintoma(s)}
              >
                <IonLabel>{s}</IonLabel>
              </IonChip>
            );
          })}
        </div>
      </IonList>

      {submitError && (
        <IonText color="danger">
          <p className="ion-padding">{submitError}</p>
        </IonText>
      )}

      <IonButton expand="block" type="submit" disabled={submitting} className="ion-margin">
        {submitting ? 'Salvando...' : 'Salvar medição'}
      </IonButton>
    </form>
  );
}
