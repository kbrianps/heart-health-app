/**
 * Tela de cadastro de usuário.
 *
 * Form com todos os campos exigidos pelo backend, validação client-side
 * via zod (espelhando regras do backend) e cadastro com auto-login após
 * sucesso.
 */

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useAuth } from '../auth/AuthContext';
import { registerSchema, type RegisterFormValues } from '../auth/schemas';
import { extractErrorMessage } from '../lib/api';

export function Register() {
  const { register: registerUser } = useAuth();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      senha: '',
      confirmarSenha: '',
      dataNascimento: '',
      sexo: 'outro',
      pais: 'Brasil',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registerUser(values);
      history.replace('/tabs/records');
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Criar conta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="stacked">Nome</IonLabel>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <IonInput
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.nome && <IonNote color="danger">{errors.nome.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Sobrenome</IonLabel>
            <Controller
              control={control}
              name="sobrenome"
              render={({ field }) => (
                <IonInput
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.sobrenome && <IonNote color="danger">{errors.sobrenome.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">E-mail</IonLabel>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <IonInput
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.email && <IonNote color="danger">{errors.email.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Telefone</IonLabel>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <IonInput
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  placeholder="+55 21 99999-0000"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.telefone && <IonNote color="danger">{errors.telefone.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Data de nascimento</IonLabel>
            <Controller
              control={control}
              name="dataNascimento"
              render={({ field }) => (
                <IonInput
                  type="date"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.dataNascimento && (
              <IonNote color="danger">{errors.dataNascimento.message}</IonNote>
            )}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Sexo</IonLabel>
            <Controller
              control={control}
              name="sexo"
              render={({ field }) => (
                <IonSelect
                  value={field.value}
                  onIonChange={(e) => field.onChange(e.detail.value)}
                  interface="popover"
                >
                  <IonSelectOption value="masculino">Masculino</IonSelectOption>
                  <IonSelectOption value="feminino">Feminino</IonSelectOption>
                  <IonSelectOption value="outro">Outro</IonSelectOption>
                </IonSelect>
              )}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">País</IonLabel>
            <Controller
              control={control}
              name="pais"
              render={({ field }) => (
                <IonInput
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.pais && <IonNote color="danger">{errors.pais.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Senha</IonLabel>
            <Controller
              control={control}
              name="senha"
              render={({ field }) => (
                <IonInput
                  type="password"
                  autocomplete="new-password"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.senha && <IonNote color="danger">{errors.senha.message}</IonNote>}
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Confirmar senha</IonLabel>
            <Controller
              control={control}
              name="confirmarSenha"
              render={({ field }) => (
                <IonInput
                  type="password"
                  autocomplete="new-password"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.confirmarSenha && (
              <IonNote color="danger">{errors.confirmarSenha.message}</IonNote>
            )}
          </IonItem>

          {submitError && (
            <IonText color="danger">
              <p className="ion-padding-start">{submitError}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={submitting}
            className="ion-margin-top"
          >
            {submitting ? 'Cadastrando...' : 'Criar conta'}
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            type="button"
            onClick={() => history.push('/login')}
          >
            Já tem conta? Entrar
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
