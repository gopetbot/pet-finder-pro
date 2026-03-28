# Documento de Requisitos: CMS Palestras Semanais

## Introdução

Esta feature adiciona uma área administrativa (CMS) ao projeto pet-finder-pro para gerenciar "Palestras Semanais". Inclui autenticação via Firebase Auth (Email/Password), um painel admin protegido com operações CRUD de palestras no Firestore, e uma área pública que exibe cards das palestras com imagens via Google Drive (Claim Check pattern).

## Glossário

- **Sistema**: A aplicação pet-finder-pro (React 18 + TypeScript + Vite)
- **AuthContext**: Contexto React que gerencia o estado global de autenticação via `onAuthStateChanged`
- **ProtectedRoute**: Componente HOC que protege rotas autenticadas, redirecionando para `/login` se não autenticado
- **LoginPage**: Página de autenticação com formulário Email/Password em `/login`
- **AdminPalestras**: Painel CMS em `/admin/palestras` com formulário de criação e lista com exclusão
- **PalestrasList**: Componente público que exibe cards das palestras na página inicial
- **PalestraCard**: Componente que renderiza os dados de uma palestra individual
- **DriveImageUtil**: Utilitário puro (`driveImage.ts`) que converte ID ou link do Google Drive em URL de visualização direta
- **Firestore**: Banco de dados NoSQL do Firebase usado para persistir as palestras
- **Firebase_Auth**: Serviço de autenticação do Firebase
- **Palestra**: Entidade com campos `titulo`, `palestrante`, `data`, `resumo`, `driveImageId` e `createdAt`
- **Admin**: Usuário autenticado com acesso ao painel CMS
- **Visitante**: Usuário não autenticado que acessa a área pública

---

## Requisitos

### Requisito 1: Configuração do Firebase SDK

**User Story:** Como desenvolvedor, quero configurar o Firebase SDK no projeto, para que os serviços de Auth e Firestore estejam disponíveis para os demais componentes.

#### Critérios de Aceitação

1. THE Sistema SHALL instalar o pacote `firebase` (^10.x) como dependência do projeto
2. THE Sistema SHALL ler as credenciais do Firebase exclusivamente de variáveis de ambiente com prefixo `VITE_FIREBASE_*`
3. THE Sistema SHALL exportar instâncias únicas de `auth` (Firebase Auth) e `db` (Firestore) a partir de um módulo `src/lib/firebase.ts`
4. IF as variáveis de ambiente `VITE_FIREBASE_*` não estiverem definidas, THEN THE Sistema SHALL lançar um erro descritivo na inicialização

---

### Requisito 2: Utilitário de Imagem do Google Drive

**User Story:** Como desenvolvedor, quero um utilitário puro para converter IDs ou links do Google Drive em URLs de visualização direta, para que os componentes possam exibir imagens sem lógica duplicada.

#### Critérios de Aceitação

1. THE DriveImageUtil SHALL exportar a função `getDriveImageUrl(idOrLink: string): string`
2. WHEN `getDriveImageUrl` recebe um ID puro do Google Drive, THE DriveImageUtil SHALL retornar a URL no formato `https://drive.google.com/uc?export=view&id={id}`
3. WHEN `getDriveImageUrl` recebe um link completo do Google Drive contendo `drive.google.com`, THE DriveImageUtil SHALL extrair o ID via regex e retornar a URL no formato `https://drive.google.com/uc?export=view&id={id}`
4. THE DriveImageUtil SHALL exportar a função `extractDriveId(link: string): string` que extrai o ID de qualquer formato de URL do Google Drive
5. THE DriveImageUtil SHALL ser uma função pura, sem efeitos colaterais ou mutações de estado externo

---

### Requisito 3: Contexto de Autenticação (AuthContext)

**User Story:** Como desenvolvedor, quero um contexto React que gerencie o estado de autenticação globalmente, para que qualquer componente possa acessar o usuário atual sem prop drilling.

#### Critérios de Aceitação

1. THE AuthContext SHALL expor `{ user: User | null, loading: boolean, signOut: () => Promise<void> }` para toda a árvore de componentes
2. WHEN o `AuthProvider` é montado, THE AuthContext SHALL inicializar um listener `onAuthStateChanged` do Firebase Auth
3. WHILE o Firebase Auth ainda não retornou a primeira resposta, THE AuthContext SHALL manter `loading: true`
4. WHEN o Firebase Auth retorna o estado do usuário, THE AuthContext SHALL atualizar `user` e definir `loading: false`
5. WHEN `signOut` é chamado, THE AuthContext SHALL chamar `signOut` do Firebase Auth e definir `user` como `null`
6. IF `useAuth` for chamado fora de um componente filho de `AuthProvider`, THEN THE AuthContext SHALL lançar um erro descritivo

---

### Requisito 4: Rota Protegida (ProtectedRoute)

**User Story:** Como admin, quero que as rotas administrativas sejam protegidas por autenticação, para que visitantes não autenticados não possam acessar o painel CMS.

#### Critérios de Aceitação

1. WHILE `loading === true` no AuthContext, THE ProtectedRoute SHALL exibir um indicador de carregamento (spinner)
2. WHEN `loading === false` e `user === null`, THE ProtectedRoute SHALL redirecionar para `/login` usando `<Navigate replace />`
3. WHEN `loading === false` e `user !== null`, THE ProtectedRoute SHALL renderizar os `children` passados como prop
4. THE ProtectedRoute SHALL nunca renderizar `children` quando `user === null` após `loading === false`

---

### Requisito 5: Página de Login (`/login`)

**User Story:** Como admin, quero uma página de login com Email/Password, para que eu possa autenticar e acessar o painel CMS.

#### Critérios de Aceitação

1. THE LoginPage SHALL exibir um formulário com campos `email` e `password`
2. WHEN o formulário é submetido com credenciais válidas, THE LoginPage SHALL chamar `signInWithEmailAndPassword` do Firebase Auth e redirecionar para `/admin/palestras`
3. WHEN o Firebase Auth retorna o erro `auth/wrong-password` ou `auth/user-not-found`, THE LoginPage SHALL exibir a mensagem "E-mail ou senha inválidos." abaixo do formulário
4. WHEN o Firebase Auth retorna o erro `auth/too-many-requests`, THE LoginPage SHALL exibir a mensagem "Muitas tentativas. Tente novamente mais tarde."
5. WHEN a LoginPage é acessada e `user !== null`, THE LoginPage SHALL redirecionar imediatamente para `/admin/palestras`
6. WHILE a requisição de login está em andamento, THE LoginPage SHALL desabilitar o botão de submit e exibir feedback visual de carregamento

---

### Requisito 6: Painel Admin de Palestras (`/admin/palestras`)

**User Story:** Como admin, quero um painel CMS para criar e excluir palestras, para que eu possa gerenciar o conteúdo exibido na área pública.

#### Critérios de Aceitação

1. THE AdminPalestras SHALL exibir um formulário controlado com os campos: `titulo`, `palestrante`, `data`, `resumo` e `driveImageId`
2. WHEN o formulário é submetido com todos os campos válidos, THE AdminPalestras SHALL chamar `addDoc` no Firestore com os dados da palestra e `createdAt: serverTimestamp()`
3. WHEN `addDoc` é concluído com sucesso, THE AdminPalestras SHALL exibir um toast de sucesso e limpar o formulário
4. IF `addDoc` falhar, THEN THE AdminPalestras SHALL exibir um toast com variante `destructive` e preservar os dados do formulário
5. THE AdminPalestras SHALL usar `onSnapshot` com `orderBy("createdAt", "desc")` para manter a lista de palestras sincronizada em tempo real com o Firestore
6. WHEN o admin clica no botão de deletar de uma palestra, THE AdminPalestras SHALL chamar `deleteDoc` com o ID do documento correspondente
7. WHEN `deleteDoc` é concluído, THE AdminPalestras SHALL refletir a remoção automaticamente na lista via `onSnapshot`
8. THE AdminPalestras SHALL cancelar o listener `onSnapshot` no cleanup do `useEffect` para evitar memory leaks
9. THE AdminPalestras SHALL exibir um botão de logout que chama `signOut` do AuthContext
10. WHEN o formulário é submetido com algum campo obrigatório vazio, THE AdminPalestras SHALL impedir a submissão e exibir mensagens de validação

---

### Requisito 7: Exibição Pública de Palestras (PalestrasList)

**User Story:** Como visitante, quero ver os cards das palestras na página inicial, para que eu possa conhecer as palestras disponíveis.

#### Critérios de Aceitação

1. WHEN a página inicial é carregada, THE PalestrasList SHALL chamar `getDocs` na coleção `palestras` do Firestore
2. WHEN `getDocs` retorna documentos, THE PalestrasList SHALL renderizar um `PalestraCard` para cada palestra, usando `getDriveImageUrl` para montar a URL da imagem
3. WHILE `getDocs` está em andamento, THE PalestrasList SHALL exibir um indicador de carregamento
4. WHEN `getDocs` retorna uma lista vazia, THE PalestrasList SHALL exibir uma mensagem indicando que não há palestras cadastradas
5. IF `getDocs` falhar, THEN THE PalestrasList SHALL exibir a mensagem "Não foi possível carregar as palestras."
6. THE PalestrasList SHALL usar `getDocs` (leitura única) em vez de `onSnapshot` para evitar listeners desnecessários na área pública

---

### Requisito 8: Modelo de Dados e Regras de Segurança do Firestore

**User Story:** Como desenvolvedor, quero um modelo de dados bem definido e regras de segurança no Firestore, para que os dados sejam consistentes e o acesso seja controlado corretamente.

#### Critérios de Aceitação

1. THE Sistema SHALL armazenar palestras na coleção `palestras` do Firestore com os campos: `titulo` (string), `palestrante` (string), `data` (string YYYY-MM-DD), `resumo` (string), `driveImageId` (string), `createdAt` (Timestamp)
2. THE Sistema SHALL aplicar regras de segurança do Firestore que permitem leitura pública (`allow read: if true`) na coleção `palestras`
3. THE Sistema SHALL aplicar regras de segurança do Firestore que permitem escrita apenas para usuários autenticados (`allow write: if request.auth != null`) na coleção `palestras`

---

### Requisito 9: Roteamento da Aplicação

**User Story:** Como desenvolvedor, quero que as rotas `/login` e `/admin/palestras` estejam configuradas no roteador da aplicação, para que a navegação entre as páginas funcione corretamente.

#### Critérios de Aceitação

1. THE Sistema SHALL registrar a rota `/login` apontando para `LoginPage` no `BrowserRouter`
2. THE Sistema SHALL registrar a rota `/admin/palestras` envolta em `ProtectedRoute` apontando para `AdminPalestras` no `BrowserRouter`
3. THE Sistema SHALL envolver toda a árvore de rotas com `AuthProvider` para que o `AuthContext` esteja disponível em todas as páginas
