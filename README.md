# App Saúde Cardíaca (Frontend Ionic)

[![CI](https://github.com/kbrianps/heart-health-app/actions/workflows/ci.yml/badge.svg)](https://github.com/kbrianps/heart-health-app/actions/workflows/ci.yml)

![Ionic](https://img.shields.io/badge/Ionic-8-3880FF?style=flat&logo=ionic&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat&logo=capacitor&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/license-GPLv3-blue?style=flat)

Frontend mobile do **Sistema de Acompanhamento de Saúde Cardíaca**,
desenvolvido como trabalho da disciplina de programação modular.
Empacotado como **APK Android** via Capacitor e também publicado como
versão web.

A API consumida é o
[heart-health-api](https://github.com/kbrianps/heart-health-api),
hospedada em `https://heart-health-api.kbrianps.com/api`.

## Equipe

- [Brian Kévin dos Santos Pravato](https://github.com/kbrianps)
- [José Henrique de Souza Furtado](https://github.com/furtadoHenrique)
- [Pedro Levi Freitas Nascimento](https://github.com/pedrolevi2003)
- [Natalha da Silva Santanna](https://github.com/NatalhaSantanna)

## Links

- **App em produção (web):** https://heart-health-app.kbrianps.com (ou https://heart-health-app.kbrianps.workers.dev)
- **API consumida:** https://heart-health-api.kbrianps.com/api
- **Documentação interativa (Swagger UI):** https://heart-health-api.kbrianps.com/docs
- **Repositório do backend:** https://github.com/kbrianps/heart-health-api
- **Licença:** [GPL-3.0](LICENSE)

## Stack

**Linguagem:** TypeScript

**Framework UI:** Ionic 8 + React 19
- Ionic provê os componentes nativos (botões, cards, tabs, modais, etc)
  com aparência nativa em iOS/Android
- React é a camada de templates e gerenciamento de estado dos componentes

**Build tool:** Vite
- Dev server muito rápido com HMR (Hot Module Replacement)
- Bundle de produção otimizado

**Empacotamento mobile:** Capacitor 8
- Empacota o app web em um APK Android (e IPA iOS, se quiser)
- Plugin oficial `@capacitor/preferences` para persistência local
  (guardar o token JWT entre sessões)

**Cliente HTTP:** axios
- Interceptor de request: anexa automaticamente
  `Authorization: Bearer <token>` em todas as chamadas autenticadas
- Interceptor de response: detecta 401 e força logout

**Validação de formulários:** zod + react-hook-form
- Schemas de validação espelham as regras do backend
  (Marshmallow no Flask), dando feedback imediato sem round-trip

**Gráficos:** Chart.js + react-chartjs-2
- Linhas para evolução temporal de pressão, frequência e peso

## Arquitetura: pastas por feature

A estrutura espelha a do backend (modularização por feature). Cada área
de negócio tem sua própria pasta com tipos, schemas, cliente HTTP e
componentes específicos.

```
src/
├── App.tsx                 # IonApp + rotas + AuthProvider
├── main.tsx                # Entry point ReactDOM
├── theme/                  # variables.css (paleta cardíaca)
├── lib/                    # infra transversal
│   ├── api.ts              # axios instance + interceptors JWT
│   ├── env.ts              # leitura de import.meta.env (VITE_*)
│   └── storage.ts          # wrapper sobre Capacitor Preferences
├── auth/                   # feature: autenticação
│   ├── api.ts              # login, registerUser
│   ├── AuthContext.tsx     # Provider com estado global de auth
│   ├── context.ts          # React.Context (separado para Fast Refresh)
│   ├── useAuth.ts          # hook que consome o context
│   ├── PrivateRoute.tsx    # guard para rotas autenticadas
│   ├── schemas.ts          # zod schemas de login e cadastro
│   └── types.ts            # tipos TS espelhando backend
├── records/                # feature: medições cardíacas
│   ├── api.ts              # criarRegistro, listarRegistros
│   ├── RecordCard.tsx      # card de item da lista
│   ├── RecordForm.tsx      # form de nova medição (modal)
│   ├── schemas.ts          # zod schema do form
│   └── types.ts
├── reports/                # feature: relatórios
│   ├── api.ts              # gerarRelatorio
│   ├── AveragesPanel.tsx   # cards com médias dos indicadores
│   ├── AlertsPanel.tsx     # lista de alertas clínicos
│   ├── SymptomsPanel.tsx   # top sintomas como chips
│   ├── charts/             # gráficos Chart.js
│   │   ├── setup.ts        # registro de componentes Chart.js
│   │   ├── PressureChart.tsx
│   │   ├── HeartRateChart.tsx
│   │   └── WeightChart.tsx
│   └── types.ts
├── pages/                  # telas (uma por rota)
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Records.tsx
│   ├── Reports.tsx
│   └── About.tsx
└── components/
    └── TabsLayout.tsx      # IonTabs com 3 abas
```

### Por que essa estrutura

- **Espelha o backend**: cada feature (`auth`, `records`, `reports`) tem
  sua pasta com `api.ts` e tipos. Argumento de modularização para a
  arguição
- **`pages/` reúne as telas**: padrão esperado pelo Ionic + React Router
- **`lib/` para infra transversal**: axios, storage, env não pertencem
  a nenhuma feature
- **`components/` para layout/UI compartilhada** (tabs, banners, etc)
- Não existe import cruzado entre páginas; navegação acontece via
  `useHistory` do React Router

## Telas e navegação

```
App.tsx
├── /login           (público)
├── /register        (público)
└── (protegido por PrivateRoute)
    └── TabsLayout
        ├── /tabs/records    (default após login)
        ├── /tabs/reports
        └── /tabs/about      (nomes do grupo + links + logout)
```

### Fluxo de autenticação

1. App abre → AuthContext lê o token do Capacitor Preferences
2. Se token existe → vai para `/tabs/records`
3. Se não → vai para `/login`
4. Login OK → salva token + redireciona para `/tabs/records`
5. Botão "Sair" no Sobre → limpa token + volta para `/login`
6. Resposta 401 do backend → interceptor do axios limpa token e
   dispara evento `auth:logout`, que é capturado pelo AuthContext
   para forçar redirect

## Como rodar localmente (versão web)

Pré-requisitos: Node 20+ e npm.

```bash
git clone https://github.com/kbrianps/heart-health-app.git
cd heart-health-app
npm install
cp .env.example .env       # se quiser, edite VITE_API_URL para apontar
                           # ao seu backend local
npm run dev
```

A app sobe em `http://localhost:5173`. Por padrão o `VITE_API_URL`
aponta para a API em produção (https://heart-health-api.kbrianps.com/api),
então não precisa subir o backend para testar.

## Testes manuais

```bash
npm run lint    # ESLint
npm run build   # build de produção (TypeScript + Vite)
```

Os formulários têm validação client-side. Tente cadastrar com:
- Email inválido (`abc` em vez de `abc@def.com`)
- Senha curta (`12345`)
- Senhas que não conferem
- Pressão sistólica acima de 250

E veja a mensagem de erro inline.

## Build do APK

Pré-requisito: Android SDK ou Android Studio instalado. Caso ainda não
tenha, instale o [Android Studio](https://developer.android.com/studio)
e aceite as licenças do SDK.

```bash
# 1. Build do bundle web (Vite gera dist/)
npm run build

# 2. Adicionar a plataforma Android (uma única vez)
npx cap add android

# 3. Copiar o build para a pasta android/
npx cap copy android

# 4. Compilar o APK debug (sem assinatura, suficiente para testes)
cd android
./gradlew assembleDebug

# O APK fica em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar no celular

Com o celular Android conectado via USB, com modo desenvolvedor ativado:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Ou copie o `.apk` para o celular e abra com o gerenciador de arquivos
(precisa permitir "instalar de fontes desconhecidas").

### Acesso à API a partir do APK

Como o backend já está em `https://heart-health-api.kbrianps.com/api`
(SSL válido, público), o APK chega lá direto. **Não há necessidade de
configurar IP local nenhum** — basta o celular ter internet.

A URL é embedada no build do APK em tempo de compilação, lendo da
variável `VITE_API_URL` do `.env` (ou do default em `src/lib/env.ts`).

## CI/CD

O projeto tem pipeline de integração contínua via **GitHub Actions**.
Todo push em `main` (ou pull request) dispara automaticamente:

```
push/PR → GitHub
       ↓
  Workflow CI (.github/workflows/ci.yml)
       ↓
   ├── Setup Node 20 com cache de npm
   ├── npm ci (instala dependências)
   ├── npm run lint (ESLint)
   └── npm run build (TypeScript + Vite)
```

O **deploy** da versão web é gerenciado pelo **Cloudflare Pages**, que
escuta o repositório no GitHub e faz build/publish a cada push em
`main`. Não é necessário workflow de deploy no GitHub Actions porque
o Pages tem seu próprio pipeline.

## Roadmap / Próximos passos

- **Build automatizado de APK** via GitHub Actions: gerar APK debug a
  cada release e disponibilizar como artifact do workflow
- **Tela de detalhes de registro**: tocar num card da lista abre tela
  com mais informações e opção de excluir
- **Modo offline**: cachear medições recentes via IndexedDB para o app
  funcionar sem internet
- **Notificações**: lembrete diário para registrar medição
- **Push notifications**: alertas quando algum indicador sair dos
  limites de referência

## Licença

[GPL-3.0](LICENSE) — mesmo do backend.
