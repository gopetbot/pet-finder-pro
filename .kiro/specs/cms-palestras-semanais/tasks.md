# Tasks: CMS Palestras Semanais

## Task List

- [x] 1. Configurar Firebase SDK
  - [x] 1.1 Instalar o pacote `firebase` (^10.x) via npm
  - [x] 1.2 Criar arquivo `.env` com as variáveis `VITE_FIREBASE_*` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
  - [x] 1.3 Criar `src/lib/firebase.ts` que inicializa o app Firebase, exporta `auth` (getAuth) e `db` (getFirestore), lançando erro descritivo se variáveis de ambiente estiverem ausentes

- [x] 2. Implementar utilitário DriveImage (`src/lib/driveImage.ts`)
  - [x] 2.1 Implementar `extractDriveId(link: string): string` que extrai o ID de qualquer formato de URL do Google Drive via regex
  - [x] 2.2 Implementar `getDriveImageUrl(idOrLink: string): string` que retorna `https://drive.google.com/uc?export=view&id={id}`, usando `extractDriveId` quando o input contiver `drive.google.com`
  - [x] 2.3 Escrever testes unitários para `getDriveImageUrl` e `extractDriveId` cobrindo: ID puro, link `/file/d/`, link `/open?id=`, e o round-trip de extração

- [x] 3. Implementar AuthContext (`src/contexts/AuthContext.tsx`)
  - [x] 3.1 Criar interface `AuthContextValue` com `user: User | null`, `loading: boolean` e `signOut: () => Promise<void>`
  - [x] 3.2 Implementar `AuthProvider` que inicializa `onAuthStateChanged` no mount, mantém `loading: true` até a primeira resposta e expõe `signOut`
  - [x] 3.3 Implementar hook `useAuth()` que lança erro descritivo se chamado fora do `AuthProvider`

- [x] 4. Implementar ProtectedRoute (`src/components/ProtectedRoute.tsx`)
  - [x] 4.1 Implementar componente que lê `user` e `loading` do `useAuth()`
  - [x] 4.2 Renderizar spinner enquanto `loading === true`
  - [x] 4.3 Redirecionar para `/login` com `<Navigate replace />` quando `loading === false` e `user === null`
  - [x] 4.4 Renderizar `children` quando `loading === false` e `user !== null`

- [x] 5. Implementar LoginPage (`src/pages/LoginPage.tsx`)
  - [x] 5.1 Criar formulário controlado com campos `email` e `password` usando react-hook-form + zod
  - [x] 5.2 Implementar `handleLogin` que chama `signInWithEmailAndPassword` e redireciona para `/admin/palestras` em caso de sucesso
  - [x] 5.3 Implementar `mapFirebaseError(code: string): string` que mapeia `auth/wrong-password`, `auth/user-not-found` e `auth/too-many-requests` para mensagens em português
  - [x] 5.4 Exibir mensagem de erro abaixo do formulário em caso de falha
  - [x] 5.5 Redirecionar para `/admin/palestras` se `user !== null` ao montar o componente
  - [x] 5.6 Desabilitar o botão de submit e exibir feedback visual durante o loading

- [x] 6. Implementar AdminPalestras (`src/pages/AdminPalestras.tsx`)
  - [x] 6.1 Criar formulário controlado com campos `titulo`, `palestrante`, `data`, `resumo` e `driveImageId` usando react-hook-form + zod (todos obrigatórios)
  - [x] 6.2 Implementar `handleAddPalestra` que chama `addDoc` com os dados do formulário e `createdAt: serverTimestamp()`
  - [x] 6.3 Exibir toast de sucesso e limpar o formulário após `addDoc` bem-sucedido; exibir toast `destructive` e preservar dados em caso de erro
  - [x] 6.4 Configurar `onSnapshot` com `orderBy("createdAt", "desc")` no `useEffect` para lista em tempo real, cancelando o listener no cleanup
  - [x] 6.5 Implementar `handleDelete(id: string)` que chama `deleteDoc` com o ID do documento
  - [x] 6.6 Exibir botão de logout que chama `signOut` do `useAuth()`

- [x] 7. Implementar PalestrasList e PalestraCard (`src/components/PalestrasList.tsx`, `src/components/PalestraCard.tsx`)
  - [x] 7.1 Implementar `PalestraCard` que recebe uma `Palestra` como prop e renderiza título, palestrante, data, resumo e imagem via `getDriveImageUrl(palestra.driveImageId)`
  - [x] 7.2 Implementar `PalestrasList` que chama `getDocs` na coleção `palestras` no mount e renderiza um `PalestraCard` por documento
  - [x] 7.3 Tratar estados de loading, lista vazia e erro no `PalestrasList`

- [x] 8. Configurar roteamento e AuthProvider em `App.tsx`
  - [x] 8.1 Envolver toda a árvore de rotas com `AuthProvider`
  - [x] 8.2 Adicionar rota `/login` apontando para `LoginPage`
  - [x] 8.3 Adicionar rota `/admin/palestras` envolta em `ProtectedRoute` apontando para `AdminPalestras`

- [x] 9. Integrar PalestrasList na página inicial e configurar Firestore Security Rules
  - [x] 9.1 Adicionar `<PalestrasList />` na página `Index.tsx` em posição adequada
  - [x] 9.2 Configurar as Firestore Security Rules no Firebase Console: leitura pública e escrita apenas para `request.auth != null` na coleção `palestras`
  - [x] 9.3 Adicionar `.env` ao `.gitignore` (se ainda não estiver)
