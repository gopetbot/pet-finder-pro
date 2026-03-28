# Requirements Document

## Introduction

Esta feature substitui o campo manual de ID de imagem do Google Drive no formulário de "Palestras Semanais" do painel administrativo (CMS) por um campo de upload de imagem nativo. A imagem é comprimida no cliente antes de ser enviada para o **Cloudinary**. A URL pública gerada pelo Cloudinary é persistida no Firestore no campo `imageUrl`, substituindo o campo legado `driveImageId`. A área pública passa a consumir `imageUrl` diretamente, eliminando a dependência do utilitário `driveImage.ts`.

## Glossary

- **Admin_Form**: O formulário React na página `AdminPalestras.tsx` utilizado para criar registos de palestras.
- **Storage_Service**: O módulo `src/services/storageService.ts` responsável pela compressão e upload de imagens para o Cloudinary.
- **Cloudinary**: O serviço de CDN e armazenamento de imagens utilizado para persistir e servir as imagens das palestras.
- **Compressor**: A biblioteca `browser-image-compression` utilizada para reduzir o tamanho e dimensões da imagem no browser antes do upload.
- **Firestore**: A base de dados NoSQL do Firebase onde os documentos de palestras são persistidos.
- **PalestraCard**: O componente React `src/components/PalestraCard.tsx` que exibe uma palestra na área pública.
- **PalestrasList**: O componente React `src/components/PalestrasList.tsx` que lista todas as palestras na área pública.
- **imageUrl**: O campo do documento Firestore que armazena a URL pública da imagem no Cloudinary.
- **driveImageId**: O campo legado do documento Firestore que armazenava o ID de imagem do Google Drive. A ser descontinuado.
- **Cloudinary_URL**: A URL pública e permanente gerada pelo Cloudinary após o upload de um ficheiro.
- **Upload_Preset**: Configuração no Cloudinary que permite uploads não assinados (unsigned) diretamente do browser.
- **Preview**: A pré-visualização local da imagem selecionada, gerada no browser antes do upload.

---

## Requirements

### Requirement 1: Configuração do Cloudinary

**User Story:** Como administrador do sistema, quero que o Cloudinary esteja configurado para receber uploads diretos do browser, para que as imagens possam ser enviadas sem necessidade de um backend intermediário.

#### Acceptance Criteria

1. THE Sistema SHALL ler as credenciais do Cloudinary exclusivamente de variáveis de ambiente com prefixo `VITE_CLOUDINARY_*` (`VITE_CLOUDINARY_CLOUD_NAME` e `VITE_CLOUDINARY_UPLOAD_PRESET`).
2. THE Cloudinary SHALL ser configurado com um **Upload Preset** do tipo `unsigned` no painel do Cloudinary, permitindo uploads diretos do browser sem assinatura de servidor.
3. THE Storage_Service SHALL fazer upload para a pasta `palestras` no Cloudinary para organizar os ficheiros.
4. IF as variáveis de ambiente `VITE_CLOUDINARY_*` não estiverem definidas, THEN THE Storage_Service SHALL lançar um erro descritivo.

---

### Requirement 2: Compressão de Imagem no Cliente

**User Story:** Como administrador, quero que a imagem seja comprimida no meu browser antes do upload, para que o consumo de armazenamento e largura de banda seja minimizado.

#### Acceptance Criteria

1. WHEN o utilizador seleciona um ficheiro de imagem, THE Compressor SHALL reduzir o tamanho do ficheiro para um máximo de 0.5 MB.
2. WHEN o utilizador seleciona um ficheiro de imagem, THE Compressor SHALL reduzir as dimensões da imagem para um máximo de 1200 píxeis na dimensão maior.
3. THE Compressor SHALL executar a compressão utilizando um Web Worker para não bloquear a thread principal do browser.
4. IF a compressão falhar, THEN THE Admin_Form SHALL exibir uma notificação de erro ao utilizador e cancelar o processo de submissão.

---

### Requirement 3: Upload de Imagem para o Cloudinary

**User Story:** Como administrador, quero que a imagem comprimida seja enviada para o Cloudinary, para que fique disponível publicamente através de uma URL permanente de CDN.

#### Acceptance Criteria

1. WHEN o formulário é submetido com um ficheiro de imagem selecionado, THE Storage_Service SHALL fazer upload do ficheiro comprimido para o Cloudinary via Upload API (`https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`).
2. THE Storage_Service SHALL enviar o `upload_preset` e a `folder` (`palestras`) no corpo do request multipart.
3. WHEN o upload for concluído com sucesso, THE Storage_Service SHALL retornar a `secure_url` da resposta do Cloudinary.
4. IF o upload falhar, THEN THE Storage_Service SHALL lançar um erro que o Admin_Form captura e exibe como notificação de falha ao utilizador.
5. THE Storage_Service SHALL aceitar apenas ficheiros dos tipos `image/jpeg`, `image/png` e `image/webp`.

---

### Requirement 4: Campo de Upload no Formulário Admin

**User Story:** Como administrador, quero um campo de upload de imagem nativo no formulário de palestras, para que eu possa selecionar uma imagem diretamente do meu dispositivo sem introduzir IDs manualmente.

#### Acceptance Criteria

1. THE Admin_Form SHALL substituir o campo de texto `driveImageId` por um campo `<input type="file">` que aceita os formatos `image/jpeg`, `image/png` e `image/webp`.
2. WHEN o utilizador seleciona um ficheiro, THE Admin_Form SHALL exibir uma Preview local da imagem antes do upload ser realizado.
3. THE Admin_Form SHALL validar que um ficheiro de imagem foi selecionado antes de permitir a submissão do formulário.
4. IF nenhum ficheiro for selecionado no momento da submissão, THEN THE Admin_Form SHALL exibir uma mensagem de erro de validação no campo de imagem.

---

### Requirement 5: Estado de Loading Durante o Processo de Upload

**User Story:** Como administrador, quero receber feedback visual claro durante o processo de compressão e upload, para que eu saiba que a operação está em curso e não submeta o formulário múltiplas vezes.

#### Acceptance Criteria

1. WHILE o processo de compressão e upload estiver em curso, THE Admin_Form SHALL desativar o botão de submissão para prevenir submissões duplicadas.
2. WHILE o processo de compressão e upload estiver em curso, THE Admin_Form SHALL exibir um indicador de loading com a mensagem "A otimizar e enviar imagem...".
3. WHEN o processo de upload for concluído (com sucesso ou falha), THE Admin_Form SHALL restaurar o botão de submissão ao estado ativo.

---

### Requirement 6: Persistência do Documento no Firestore

**User Story:** Como administrador, quero que a URL da imagem seja guardada no documento da palestra no Firestore, para que a área pública possa exibir a imagem corretamente.

#### Acceptance Criteria

1. WHEN o upload da imagem for concluído com sucesso, THE Admin_Form SHALL guardar o documento da palestra no Firestore com o campo `imageUrl` contendo a `secure_url` retornada pelo Storage_Service.
2. THE Admin_Form SHALL guardar o documento da palestra no Firestore sem o campo `driveImageId`.
3. WHEN o documento for guardado com sucesso, THE Admin_Form SHALL exibir uma notificação de sucesso e limpar o formulário.
4. IF a persistência no Firestore falhar, THEN THE Admin_Form SHALL exibir uma notificação de erro e preservar os dados do formulário.

---

### Requirement 7: Atualização da Área Pública

**User Story:** Como visitante do site, quero ver as imagens das palestras carregadas diretamente do Cloudinary, para que a experiência visual seja consistente e as imagens sejam exibidas com performance de CDN.

#### Acceptance Criteria

1. THE PalestraCard SHALL exibir a imagem da palestra utilizando o campo `imageUrl` do documento Firestore como valor do atributo `src` da tag `<img>`.
2. THE PalestraCard SHALL incluir o atributo `loading="lazy"` na tag `<img>` para otimizar o carregamento da página.
3. THE PalestraCard SHALL deixar de utilizar a função `getDriveImageUrl` do módulo `driveImage.ts`.
4. THE PalestrasList SHALL passar o campo `imageUrl` ao PalestraCard através da interface `Palestra` atualizada.

---

### Requirement 8: Descontinuação do Campo Legado

**User Story:** Como developer, quero que o campo `driveImageId` e o utilitário `driveImage.ts` sejam removidos do codebase, para que não existam dependências obsoletas que possam causar confusão ou erros.

#### Acceptance Criteria

1. THE Admin_Form SHALL remover toda a referência ao campo `driveImageId` do schema Zod, da interface `Palestra` e do formulário.
2. THE PalestraCard SHALL remover a importação e utilização do módulo `driveImage.ts`.
3. THE Storage_Service SHALL ser o único ponto de integração com o Cloudinary para operações de upload de imagens de palestras.
