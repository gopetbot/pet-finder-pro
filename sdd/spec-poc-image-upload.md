# Contexto da Feature
Estamos a atualizar a área administrativa (CMS) do repositório `https://github.com/gopetbot/pet-finder-pro`. O objetivo é melhorar a usabilidade do formulário de "Palestras Semanais", substituindo a introdução manual de IDs por um campo de **Upload de Imagem Nativo** no frontend React. 
Para garantir a eficiência de custos e performance da infraestrutura, é estritamente necessário comprimir a imagem no cliente antes de realizar o upload.

# Nova Arquitetura de Media (Pattern Claim Check via Firebase Storage)
1.  **Compressão no Cliente:** Utilizar a biblioteca `browser-image-compression` para reduzir drasticamente o peso e as dimensões da imagem diretamente no browser do utilizador.
2.  **Persistência de Ficheiro:** O ficheiro binário já otimizado (idealmente convertido para WebP ou JPEG comprimido) será guardado no **Firebase Storage**.
3.  **Referência e Database:** O Storage gerará uma **Download URL** pública, que será guardada no documento da palestra no Firestore, no campo `imageUrl`. O campo antigo `driveImageId` deve ser descontinuado.

# Tarefas de Implementação (Passo a Passo)

**Passo 1: Configuração do Firebase Storage**
- No ficheiro `firebaseConfig.ts`, inicialize o Firebase Storage utilizando `getStorage(app)`.
- Crie um ficheiro `firestore_rules/storage.rules` com regras de segurança: leitura pública (`allow read: if true;`) e escrita apenas para utilizadores autenticados (`allow write: if request.auth != null;`).

**Passo 2: Utilitário de Compressão e Upload (`src/services/storageService.ts`)**
- Instale o pacote `browser-image-compression`.
- Crie uma função assíncrona `uploadTalkImage(file: File): Promise<string>`.
- **Lógica da Função:**
  1. Aplique a compressão no ficheiro original. Opções recomendadas: `{ maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: true }`.
  2. Crie uma referência única no Storage (ex: `palestras/{data_hora}_{nome_ficheiro_otimizado}`).
  3. Realize o upload do ficheiro comprimido usando `uploadBytes`.
  4. Retorne a URL final usando `getDownloadURL`.

**Passo 3: Atualização do Formulário Admin (`src/pages/admin/palestras`)**
- Remova o campo de texto antigo.
- Adicione um componente `<input type="file" accept="image/jpeg, image/png, image/webp" />` estilizado com Tailwind.
- Implemente uma pré-visualização (preview) local da imagem selecionada.
- Atualize a lógica de submissão do formulário:
    - Chame a função `uploadTalkImage`.
    - Aguarde a geração da URL e adicione-a ao objeto da palestra (`imageUrl`).
    - Guarde o documento no Firestore.
- Implemente um estado de *loading* visual claro (ex: "A otimizar e enviar imagem...") que bloqueie o botão de submissão durante o processo.

**Passo 4: Atualização da Área Pública**
- No componente de listagem (ex: `PalestrasList.tsx`), atualize a tag `<img>` para consumir diretamente a propriedade `imageUrl` do documento do Firestore: `<img src={palestra.imageUrl} alt={palestra.titulo} loading="lazy" />`.

# Restrições e Guias de Estilo
- Mantenha a componentização limpa e fortemente tipada com TypeScript.
- Utilize Tailwind CSS para estilizar os novos campos, mantendo a consistência visual.
- Garanta *feedbacks* visuais (Toast ou Alerts) em caso de falha na compressão ou no upload.