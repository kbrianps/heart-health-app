/**
 * Tela de login.
 *
 * Form simples com email + senha, validado pelo zod via react-hook-form.
 * Em sucesso, o AuthContext salva o token e o redirect acontece via
 * useEffect quando isAuthenticated vira true.
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
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import { useAuth } from '../auth/AuthContext';
import { loginSchema, type LoginFormValues } from '../auth/schemas';
import { extractErrorMessage } from '../lib/api';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  useIonViewWillEnter(() => {
    if (isAuthenticated) {
      history.replace('/tabs/records');
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await login(values.email, values.senha);
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
          <IonTitle>Entrar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <IonLabel position="stacked">Senha</IonLabel>
            <Controller
              control={control}
              name="senha"
              render={({ field }) => (
                <IonInput
                  type="password"
                  autocomplete="current-password"
                  value={field.value}
                  onIonInput={(e) => field.onChange(e.detail.value ?? '')}
                />
              )}
            />
            {errors.senha && <IonNote color="danger">{errors.senha.message}</IonNote>}
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
            {submitting ? 'Entrando...' : 'Entrar'}
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            type="button"
            onClick={() => history.push('/register')}
          >
            Não tem conta? Cadastre-se
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
