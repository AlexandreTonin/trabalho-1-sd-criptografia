# Trabalho 1 - Segurança de Dados (Criptografia)

Aplicação web em **Node.js + TypeScript + Express** para armazenar arquivos criptografados (sistema de banco de arquivos criptografados).

## Requisitos

- **Node.js 18+** (recomendado: Node.js 20 LTS)
- **npm** (normalmente já vem com o Node.js)

## Tecnologias

- TypeScript
- Express (servidor web)
- Handlebars (renderizar páginas)
- Multer (file storage)
- Crypto nativo do Node.js (AES-256-GCM)

## Configuração do ambiente

1. Clone o repositório e entre na pasta do projeto.

```bash
git clone https://github.com/alexandretonin/trabalho-1-sd-criptografia && cd trabalho-1-sd-criptografia
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

4. Defina a variável `FILE_ENCRYPTION_KEY` no `.env`.

Exemplo:

```env
FILE_ENCRYPTION_KEY=chave_hex_64
```

> Observação: use uma chave forte, de preferência chave aleatória de 32 bytes em HEX.

## Como executar

```bash
npm run dev
```

A aplicação ficará disponível em:

- http://localhost:3000

## Como usar a aplicação

1. Acesse `/files`.
2. Clique em **Enviar Arquivo** para fazer upload.
3. O arquivo é salvo já criptografado na pasta `storage/` com base na chave presente no arquivo .env.
4. Para baixar, clique em um arquivo e informe a **chave de descriptografia**.
5. Se a chave estiver incorreta, a aplicação mostra mensagem de acesso negado, se estiver correta, o arquivo será baixado automaticamente.

## Rotas principais

- `GET /files` → lista arquivos
- `POST /files` → upload de arquivo + criptografia (campo `file`, limite 15 MB)
- `GET /files/:id?key=...` → download e descriptografia

## Estrutura do projeto

```text
src/
  app.ts
  server.ts
  controllers/
    file.controller.ts
  services/
    crypto.service.ts
    file.service.ts
  views/
    files.hbs
    layouts/
      main.hbs
```

## Observações de segurança

- A chave em `.env` é necessária para criptografar e descriptografar arquivos.
- Sem a chave correta, o download descriptografado não é permitido.
- Nunca versionar `.env` com chave real.

## Caso de uso de real

Armazenamento seguro de documentos sensíveis

Empresas frequentemente precisam guardar arquivos como:

- contratos
- documentos internos
- relatórios financeiros
- projetos confidenciais

Nesse cenário:

1. o usuário envia o documento
2. o servidor criptografa o arquivo
3. apenas usuários com a chave conseguem recuperar o conteúdo

Mesmo que alguém copie o disco do servidor, o arquivo continuará ilegível.

Esse modelo é usado em serviços de armazenamento seguro de documentos corporativos.
