# API de Livros

Projeto da disciplina de Computação em Nuvem e Web Services, da Faculdade Nova Roma, cuja proposta era desenvolver uma API RESTful utilizando os verbos HTTP (GET, POST, PUT, PATCH, DELETE), hospedá-la em uma plataforma gratuita e documentá-la adequadamente.

O domínio escolhido foi um sistema de gerenciamento de livros, desenvolvido com **Node.js** e **NestJS**.

A API pode ser testada localmente (`http://localhost:3000`) ou diretamente na versão hospedada em produção (`https://api-livros-9k0q.onrender.com`), por meio do Swagger, do Postman ou de requisições via terminal (curl).

---

## Atributos do livro

- `id`
- `titulo`
- `autor`
- `genero`
- `anoPublicacao`
- `disponivel`
- `criadoEm`

---

## Tecnologias utilizadas

- **Node.js** — runtime responsável por executar JavaScript/TypeScript no servidor
- **NestJS** — organiza o projeto em Controller/Service/Module e gera a documentação Swagger automaticamente
- **TypeORM** — realiza a comunicação com o banco de dados sem a necessidade de escrever SQL manualmente
- **better-sqlite3** — banco de dados em arquivo único (`banco.sqlite`), sem exigir servidor externo
- **class-validator** — responsável por validar os dados recebidos nas requisições
- **@nestjs/swagger** — gera a documentação interativa disponível em `/api`

---

## Arquitetura do projeto

```
Requisição chega
      │
      ▼
Controller   → recebe a rota e o verbo HTTP (livros.controller.ts)
      │
      ▼
DTO          → valida o formato dos dados (pasta dto/)
      │
      ▼
Service      → contém a lógica de negócio (livros.service.ts)
      │
      ▼
Repository (TypeORM) → converte em SQL e acessa o banco
      │
      ▼
banco.sqlite → onde os dados são persistidos
```

- `src/livros/livro.entity.ts` — estrutura da tabela
- `src/livros/dto/` — formatos esperados nas requisições
- `src/livros/livros.controller.ts` — rotas
- `src/livros/livros.service.ts` — lógica de negócio
- `src/livros/livros.module.ts` — agrupa os componentes do módulo
- `src/app.module.ts` — configuração da conexão com o banco
- `src/main.ts` — inicialização da aplicação

---

## Hospedagem

A aplicação está hospedada no **[Render](https://render.com)**, plano gratuito, conectado ao repositório no GitHub com deploy automático.

`render.yaml`:

```yaml
buildCommand: npm install && npm run build
startCommand: node dist/main
```

> No plano gratuito, o disco é temporário: caso o serviço seja reiniciado, o `banco.sqlite` é resetado.

---

## Rotas da API

| Verbo | Rota | Descrição |
|---|---|---|
| `GET` | `/livros` | Lista todos os livros |
| `GET` | `/livros/:id` | Busca um livro específico pelo id |
| `POST` | `/livros` | Cria um novo livro |
| `PUT` | `/livros/:id` | Substitui o livro inteiro |
| `PATCH` | `/livros/:id` | Atualiza apenas a disponibilidade |
| `DELETE` | `/livros/:id` | Remove o livro |

### Exemplo — criação de um livro (POST)

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

Resposta:

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

## Execução local

Requer Node 18 ou superior.

```bash
npm install
npm run start:dev
```

Ao iniciar, o terminal exibe:

```
Aplicação rodando em: http://localhost:3000
Swagger disponível em: http://localhost:3000/api
```

O arquivo `banco.sqlite` é criado automaticamente na raiz do projeto na primeira execução.

---

## Como testar cada rota

### Pelo Swagger

1. Com o servidor em execução, acessar `http://localhost:3000/api`
2. As rotas estão agrupadas em "Livros"
3. Selecionar a rota desejada e clicar em **Try it out**
4. Preencher o corpo da requisição (já vem um exemplo preenchido) e clicar em **Execute**
5. A resposta é exibida abaixo, junto com o status code

### Pelo terminal (curl) — ambiente local

```bash
# criar
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit","autor":"J.R.R. Tolkien","genero":"Fantasia","anoPublicacao":1937,"disponivel":true}'

# listar
curl http://localhost:3000/livros

# buscar um
curl http://localhost:3000/livros/1

# atualizar inteiro
curl -X PUT http://localhost:3000/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit - Edição Especial","autor":"J.R.R. Tolkien","genero":"Fantasia","anoPublicacao":1937,"disponivel":false}'

# atualizar só a disponibilidade
curl -X PATCH http://localhost:3000/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"disponivel":true}'

# remover
curl -X DELETE http://localhost:3000/livros/1
```

### Pelo terminal (curl) — aplicação hospedada

```bash
curl https://api-livros-9k0q.onrender.com/livros

curl -X POST https://api-livros-9k0q.onrender.com/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Duna","autor":"Frank Herbert","genero":"Ficção Científica","anoPublicacao":1965,"disponivel":true}'

curl -X PUT https://api-livros-9k0q.onrender.com/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit - Edição Especial","autor":"J.R.R. Tolkien","genero":"Fantasia","anoPublicacao":1937,"disponivel":false}'

curl -X PATCH https://api-livros-9k0q.onrender.com/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"disponivel":true}'

curl -X DELETE https://api-livros-9k0q.onrender.com/livros/1
```

### Pelo Postman

1. Criar uma Collection (ex.: "API de Livros")
2. Para cada rota, selecionar o verbo correspondente, informar a URL e, em requisições POST/PUT/PATCH, utilizar a aba **Body → raw → JSON**
3. Clicar em **Send**

> O Render "dorme" a aplicação após um período de inatividade — a primeira requisição subsequente pode levar de 30 a 50 segundos para responder.

### Verificando os dados no banco

Extensão **SQLite Viewer** (VS Code): clicar com o botão direito em `banco.sqlite` → **Open With SQLite Viewer**. Após qualquer POST, PUT, PATCH ou DELETE, basta atualizar a visualização para ver a alteração refletida.

A opção `logging: true` está habilitada na configuração do TypeORM (`app.module.ts`), exibindo no terminal cada query SQL executada durante a operação do servidor.

---

## Testes realizados

Cada rota foi testada manualmente durante o desenvolvimento, tanto no ambiente local quanto após a hospedagem:

| Teste | Verbo | Resultado esperado | Status |
|---|---|---|---|
| Listar sem nenhum livro cadastrado | GET /livros | Retorna `[]` | ✅ |
| Criar livro com dados válidos | POST /livros | Retorna o livro criado, status 201 | ✅ |
| Criar livro com ano inválido | POST /livros | Retorna erro de validação, status 400 | ✅ |
| Buscar livro existente | GET /livros/:id | Retorna o livro, status 200 | ✅ |
| Buscar livro inexistente | GET /livros/:id | Status 404 | ✅ |
| Atualizar livro existente | PUT /livros/:id | Retorna o livro atualizado, status 200 | ✅ |
| Atualizar apenas a disponibilidade | PATCH /livros/:id | Altera somente esse campo, status 200 | ✅ |
| Remover livro existente | DELETE /livros/:id | Status 204, sem corpo | ✅ |
| Remover livro inexistente | DELETE /livros/:id | Status 404 | ✅ |

---

## Build para produção

```bash
npm run build
node dist/main
```

## Deploy

| Informação | Valor |
|---|---|
| URL da API | https://api-livros-9k0q.onrender.com |
| Swagger em produção | https://api-livros-9k0q.onrender.com/api |
| Repositório | [RaissaMariaB/api-livros](https://github.com/RaissaMariaB/api-livros) |
| Deploy automático | A cada push na branch `main`, o Render reconstrói e reinicia o serviço |

| Alteração | Reflete no Render? |
|---|---|
| Código (`src/*.ts`) | Sim — novo build e reinício com o código atualizado |
| `render.yaml` | Sim — pode alterar a configuração de build/start |
| Apenas o README | Dispara um novo deploy, mas não altera o comportamento da API |
| Dados inseridos via POST/PUT/etc | Não aparecem no painel do Render — são conteúdo do banco, não código. Só podem ser verificados testando a própria API (curl, Postman ou Swagger) |
