# Contexto do Projeto
Você é um desenvolvedor Frontend Sênior especialista em React, TypeScript, Vite e Firebase. 
Estamos trabalhando no repositório `https://github.com/gopetbot/pet-finder-pro` (gerado inicialmente via Lovable).
O objetivo agora é criar uma Prova de Conceito (PoC) de uma área administrativa (estilo CMS) para gerenciar a seção de "Palestras Semanais".

# Arquitetura e Requisitos Técnicos
1. **Frontend:** React com TypeScript e Vite. Roteamento via `react-router-dom` (ou similar já existente no projeto).
2. **Autenticação (Firebase Auth):** Utilizar o provedor de Email/Password do Firebase (`signInWithEmailAndPassword`). O estado de autenticação deve ser gerenciado globalmente ou via Context API com o hook `onAuthStateChanged`.
3. **Banco de Dados:** Cloud Firestore. 
   - Coleção: `palestras`
   - Estrutura do Documento: `{ titulo: string, palestrante: string, data: string, resumo: string, driveImageId: string, createdAt: timestamp }`
4. **Storage (Pattern Claim Check com Google Drive):** 
   - Não faremos upload nativo de arquivos. O usuário apenas colará o ID da imagem do Google Drive no campo `driveImageId`.
   - O sistema deve ter uma função utilitária pura que converta esse ID em uma URL de visualização direta: `https://drive.google.com/uc?export=view&id={driveImageId}`.

# Tarefas de Implementação (Passo a Passo)

**Passo 1: Configuração do Firebase e Regras de Segurança**
- Crie ou atualize o arquivo `firebaseConfig.ts` para inicializar o `getAuth` e o `getFirestore`.
- Crie um arquivo `firestore.rules` na raiz do projeto com as seguintes regras básicas: leitura pública (`allow read: if true;`) e escrita apenas para usuários autenticados (`allow write: if request.auth != null;`).

**Passo 2: Utilitários**
- Crie o arquivo `utils/driveImage.ts` contendo a função que extrai o ID de um link do Drive (se o usuário colar o link inteiro) e retorna a URL formatada do `uc?export=view`.

**Passo 3: Autenticação e Proteção de Rotas**
- Crie a página de Login (`/login`) contendo um formulário limpo de e-mail e senha, com tratamento de erros (ex: "Credenciais inválidas").
- Crie um componente `ProtectedRoute` que envolva as rotas do CMS. Se o `onAuthStateChanged` retornar null, redirecione para `/login`. Adicione um estado visual de *loading* enquanto o Firebase verifica a sessão.

**Passo 4: Área Administrativa (CMS - /admin/palestras)**
- Implemente um formulário para adicionar uma nova palestra (campos: Título, Palestrante, Data, Resumo, Link/ID da Imagem no Drive).
- Ao enviar, grave o documento na coleção `palestras` do Firestore.
- Logo abaixo do formulário, exiba uma lista das palestras cadastradas (buscando do Firestore em tempo real via `onSnapshot` ou `getDocs`), permitindo a exclusão rápida (botão de deletar).

**Passo 5: Área Pública (Exibição)**
- Crie um componente público `PalestrasList.tsx` (ou atualize a página inicial) que faça o *fetch* da coleção `palestras`.
- Renderize um card iterando sobre os dados. Utilize a função do Passo 2 para exibir a imagem corretamente na tag `<img>`.

# Restrições e Guias de Estilo
- Mantenha o código limpo, componentizado e fortemente tipado com interfaces/types do TypeScript.
- Utilize Tailwind CSS para estilização. Siga os padrões de design de interfaces modernas, mantendo os formulários acessíveis e fáceis de usar.
- Trate sempre os estados de *loading*, *success* e *error* (tanto no login quanto no CRUD do Firestore) com feedbacks visuais claros para o usuário.