# API de Livros

API RESTful para gerenciamento de um acervo de livros, desenvolvida com **Node.js** e **NestJS**. Permite criar, listar, atualizar, atualizar parcialmente e remover livros, com documentação interativa via **Swagger**.

---

## Sobre o projeto

O domínio escolhido foi um **sistema de gerenciamento de livros**. Cada livro possui:

| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único (gerado automaticamente) |
| `titulo` | string | Título do livro |
| `autor` | string | Autor do livro |
| `genero` | string | Gênero literário (ex: Fantasia, Romance) |
| `anoPublicacao` | number | Ano em que o livro foi publicado |
| `disponivel` | boolean | Se o livro está disponível para empréstimo |
| `criadoEm` | Date | Data de criação do registro (gerada automaticamente) |

A API expõe os 5 verbos HTTP principais (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) sobre o recurso `/livros`.

---

## Tecnologias e por que foram escolhidas

| Tecnologia | Papel no projeto | Por que essa escolha |
|---|---|---|
| **Node.js** | Runtime que executa o servidor | Padrão de mercado para APIs JavaScript/TypeScript, não-bloqueante e leve |
| **NestJS** | Framework da API | Organiza o código em módulos (Controller/Service/Module), tem injeção de dependência nativa e gera documentação Swagger com poucas linhas |
| **TypeORM** | ORM (mapeamento objeto-relacional) | Permite manipular o banco com objetos TypeScript em vez de escrever SQL manualmente. Integra nativamente com o NestJS via `@nestjs/typeorm` |
| **better-sqlite3** | Driver do banco de dados | Banco de dados em arquivo, não exige instalar nem configurar um servidor de banco separado — ideal para hospedagem gratuita e para desenvolvimento local |
| **class-validator / class-transformer** | Validação dos dados recebidos | Garante que o corpo das requisições (DTOs) seja validado automaticamente antes de chegar na lógica de negócio (ex: rejeita ano de publicação inválido) |
| **@nestjs/swagger** | Documentação interativa | Gera uma página visual em `/api` onde é possível ler e testar todos os endpoints sem precisar de ferramentas externas |

---

## Como o projeto funciona (arquitetura)

```
Requisição HTTP
      │
      ▼
Controller   (livros.controller.ts)   → recebe a rota e o método HTTP
      │
      ▼
DTO          (create-livro.dto.ts)    → valida o formato dos dados recebidos
      │
      ▼
Service      (livros.service.ts)      → contém a lógica de negócio
      │
      ▼
Repository   (TypeORM)                → traduz para SQL e acessa o banco
      │
      ▼
banco.sqlite (arquivo do banco)       → onde os dados ficam salvos
```

- **`src/livros/livro.entity.ts`** — define a estrutura da tabela `livros` no banco.
- **`src/livros/dto/`** — define o formato esperado de cada tipo de requisição (criação, atualização completa, atualização parcial).
- **`src/livros/livros.controller.ts`** — define as rotas (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`).
- **`src/livros/livros.service.ts`** — contém os métodos que conversam com o banco via TypeORM.
- **`src/livros/livros.module.ts`** — agrupa Controller + Service + Entity.
- **`src/app.module.ts`** — configura a conexão com o banco SQLite.
- **`src/main.ts`** — inicializa o servidor, ativa validação global e configura o Swagger.

---

## Servidor escolhido para hospedagem

A aplicação será hospedada no **[Render](https://render.com)** (plano gratuito), porque:

- Conecta direto a um repositório GitHub e faz deploy automático a cada push
- Não exige cartão de crédito no plano gratuito
- O arquivo `render.yaml` já está configurado no projeto com o build e start command corretos

Configuração usada (`render.yaml`):

```yaml
buildCommand: npm install && npm run build
startCommand: node dist/main
```

> **Observação:** no plano gratuito do Render o sistema de arquivos é temporário — se o serviço reiniciar, o `banco.sqlite` é resetado. Para este projeto acadêmico isso é aceitável; em produção real seria usado um banco externo (ex: PostgreSQL).

---

## Rotas da API

Base URL local: `http://localhost:3000`

| Método | Rota | Descrição | Corpo da requisição | Resposta de sucesso |
|---|---|---|---|---|
| `GET` | `/livros` | Lista todos os livros | — | `200 OK` + array de livros |
| `GET` | `/livros/:id` | Busca um livro pelo ID | — | `200 OK` + livro / `404` se não existir |
| `POST` | `/livros` | Cria um novo livro | `{ titulo, autor, genero, anoPublicacao, disponivel? }` | `201 Created` + livro criado |
| `PUT` | `/livros/:id` | Atualiza um livro inteiro | `{ titulo?, autor?, genero?, anoPublicacao?, disponivel? }` | `200 OK` + livro atualizado / `404` |
| `PATCH` | `/livros/:id` | Atualiza só a disponibilidade | `{ disponivel }` | `200 OK` + livro atualizado / `404` |
| `DELETE` | `/livros/:id` | Remove um livro | — | `204 No Content` / `404` |

### Exemplo de requisição (POST)

```json
POST /livros
{
  "titulo": "O Hobbit",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "anoPublicacao": 1937,
  "disponivel": true
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "titulo": "O Hobbit",
  "autor": "J.R.R. Tolkien",
  "genero": "Fantasia",
  "anoPublicacao": 1937,
  "disponivel": true,
  "criadoEm": "2026-06-22T10:00:00.000Z"
}
```

---

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior)
- npm (já vem junto com o Node.js)

### Passos

```bash
# 1. instalar as dependências
npm install

# 2. rodar em modo desenvolvimento (reinicia automaticamente a cada alteração)
npm run start:dev
```

Quando o servidor iniciar, você verá no terminal:

```
Aplicação rodando em: http://localhost:3000
Swagger disponível em: http://localhost:3000/api
```

O arquivo **`banco.sqlite`** será criado automaticamente na raiz do projeto na primeira execução — é o banco de dados local (fake/local) usado para os testes.

---

## Como testar cada rota e ver o resultado no banco

Existem duas formas: pelo **Swagger** (mais visual, recomendado) ou por **linha de comando com curl**.

### Opção 1 — Testando pelo Swagger (recomendado)

1. Com o servidor rodando, acesse `http://localhost:3000/api`
2. Você verá todas as rotas agrupadas em **Livros**
3. Clique em uma rota (ex: `POST /livros`) → **Try it out**
4. Preencha o corpo da requisição (já vem um exemplo preenchido)
5. Clique em **Execute**
6. O Swagger mostra a resposta da API abaixo, com o status code

### Opção 2 — Testando por terminal (curl)

**Criar um livro (POST):**
```bash
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit","autor":"J.R.R. Tolkien","genero":"Fantasia","anoPublicacao":1937,"disponivel":true}'
```

**Listar todos os livros (GET):**
```bash
curl http://localhost:3000/livros
```

**Buscar um livro pelo ID (GET):**
```bash
curl http://localhost:3000/livros/1
```

**Atualizar um livro inteiro (PUT):**
```bash
curl -X PUT http://localhost:3000/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit - Edição Especial","autor":"J.R.R. Tolkien","genero":"Fantasia","anoPublicacao":1937,"disponivel":false}'
```

**Atualizar só a disponibilidade (PATCH):**
```bash
curl -X PATCH http://localhost:3000/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"disponivel":true}'
```

**Remover um livro (DELETE):**
```bash
curl -X DELETE http://localhost:3000/livros/1
```

### Verificando o resultado direto no banco de dados

O banco é o arquivo `banco.sqlite` na raiz do projeto. Para visualizar os dados salvos:

1. Instale a extensão **SQLite Viewer** no VS Code
2. Clique com o botão direito no arquivo `banco.sqlite` no explorador de arquivos do VS Code
3. Selecione **Open With SQLite Viewer**
4. A tabela `livros` aparece com todos os registros — toda vez que você faz um `POST`, `PUT`, `PATCH` ou `DELETE`, basta atualizar essa visualização para ver a mudança refletida no banco

---

## Testes realizados

Durante o desenvolvimento, os seguintes testes manuais foram executados via terminal (curl) e Swagger para validar o funcionamento de cada verbo HTTP:

| Teste | Verbo | Resultado esperado | Status |
|---|---|---|---|
| Listar livros sem nenhum cadastro | `GET /livros` | Retorna `[]` com status `200` | ✅ Passou |
| Criar livro com dados válidos | `POST /livros` | Retorna o livro criado com status `201` | ✅ Passou |
| Criar livro com ano inválido (ex: texto) | `POST /livros` | Retorna erro de validação `400` | ✅ Passou |
| Buscar livro existente pelo ID | `GET /livros/:id` | Retorna o livro com status `200` | ✅ Passou |
| Buscar livro inexistente pelo ID | `GET /livros/:id` | Retorna `404 Not Found` | ✅ Passou |
| Atualizar livro existente | `PUT /livros/:id` | Retorna livro atualizado com status `200` | ✅ Passou |
| Atualizar disponibilidade | `PATCH /livros/:id` | Retorna livro com `disponivel` alterado, status `200` | ✅ Passou |
| Remover livro existente | `DELETE /livros/:id` | Retorna status `204`, sem corpo | ✅ Passou |
| Remover livro inexistente | `DELETE /livros/:id` | Retorna `404 Not Found` | ✅ Passou |

---

## Build para produção

```bash
npm run build
node dist/main
```

## Deploy

A aplicação está hospedada no **Render**: `https://api-livros-xxxx.onrender.com`
Documentação Swagger em produção: `https://api-livros-xxxx.onrender.com/api`
