/**
 * Tela "Sobre" do app.
 *
 * Atende ao requisito explícito do enunciado do trabalho de front-end:
 * "deve conter uma tela com os nomes dos integrantes do grupo".
 *
 * Lista também links para o repositório do app, o repositório da API,
 * a documentação interativa (Swagger UI) e a documentação Postman.
 * Inclui o botão de logout (limpa o token e volta para /login).
 */

import { useHistory } from 'react-router-dom';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  bookOutline,
  documentTextOutline,
  logoGithub,
  logOutOutline,
  serverOutline,
} from 'ionicons/icons';

import { useAuth } from '../auth/useAuth';

const TEAM = [
  {
    name: 'Brian Kévin dos Santos Pravato',
    github: 'https://github.com/kbrianps',
    handle: 'kbrianps',
  },
  {
    name: 'José Henrique de Souza Furtado',
    github: 'https://github.com/furtadoHenrique',
    handle: 'furtadoHenrique',
  },
  {
    name: 'Pedro Levi Freitas Nascimento',
    github: 'https://github.com/pedrolevi2003',
    handle: 'pedrolevi2003',
  },
  {
    name: 'Natalha da Silva Santanna',
    github: 'https://github.com/NatalhaSantanna',
    handle: 'NatalhaSantanna',
  },
];

const LINKS = [
  {
    label: 'Repositório do app (frontend)',
    url: 'https://github.com/kbrianps/heart-health-app',
    icon: logoGithub,
  },
  {
    label: 'Repositório da API (backend)',
    url: 'https://github.com/kbrianps/heart-health-api',
    icon: logoGithub,
  },
  {
    label: 'Swagger UI da API',
    url: 'https://heart-health-api.kbrianps.com/docs',
    icon: serverOutline,
  },
  {
    label: 'Documentação Postman',
    url: 'https://documenter.getpostman.com/view/26915556/2sBXqGsNJb',
    icon: documentTextOutline,
  },
  {
    label: 'Contrato OpenAPI (yaml)',
    url: 'https://heart-health-api.kbrianps.com/openapi.yaml',
    icon: bookOutline,
  },
];

export function About() {
  const { logout, user } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Sobre</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Saúde Cardíaca</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            App para acompanhamento de medições cardíacas, desenvolvido
            como trabalho da disciplina de programação modular.
          </IonCardContent>
        </IonCard>

        <IonList>
          <IonListHeader>
            <IonLabel>Equipe</IonLabel>
          </IonListHeader>
          {TEAM.map((member) => (
            <IonItem
              key={member.handle}
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              detail
            >
              <IonAvatar slot="start">
                <img
                  src={`https://github.com/${member.handle}.png`}
                  alt={member.name}
                />
              </IonAvatar>
              <IonLabel>
                <h3>{member.name}</h3>
                <IonNote>@{member.handle}</IonNote>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Links úteis</IonLabel>
          </IonListHeader>
          {LINKS.map((link) => (
            <IonItem
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              detail
            >
              <IonIcon icon={link.icon} slot="start" />
              <IonLabel>{link.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        {user && (
          <IonNote className="ion-padding-start">
            Logado como {user.nome} ({user.email})
          </IonNote>
        )}

        <IonButton
          expand="block"
          color="danger"
          className="ion-margin-top"
          onClick={handleLogout}
        >
          <IonIcon icon={logOutOutline} slot="start" />
          Sair
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
