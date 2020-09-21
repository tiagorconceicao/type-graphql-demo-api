# Demonstração de API GraphQL usando Typescript

(...em deselvolvimento)

Demonstração de API GraphQL com 3 níveis de autenticação (Admin, Account e User).

Os objetivos básicos são:

- Permitir que **Admins** possam gerenciar **Accounts**.
- Cada **Account** pode gerenciar apenas seus **Items** e **Users**.
- Registrar **Users** em uma determinada **Account**.

## Stack utilizada

- Typescript
- Node.js
- MySQL
- Redis

## Requisitos

- [Node.js]
- [Yarn]
- [Docker Compose] (necessário para montar o Database e Redis localmente.)

[node.js]: https://nodejs.org
[yarn]: https://yarnpkg.com/getting-started/install
[docker compose]: https://docs.docker.com/compose/install

---

## Instruções

### Instalação de dependências

```sh
yarn
```

### Instalação e Inicialização de Database e Redis

```sh
docker-compose up -d
```

### Database Migrations

Executa migrations e preenche Database com valores de teste:

```sh
yarn typeorm:migrate
yarn typeorm:seed
```

(Opcional) Limpa Database e executa migrations:

```sh
yarn typeorm:refresh
```

(Opcional) Limpa Database, executa migrations e preenche com valores de teste

```sh
yarn typeorm:refresh:seed
```

### Variáveis de ambiente

Por este projeto ser uma demonstração as variáveis de ambiente já estão configuradas, porém podem ser alteradas no arquivo **.env**

### Testes (em desenvolvimento)

```sh
yarn test
```

---

### Inicialização do servidor

```sh
yarn start
```

### Endpoint

Após realizar toda a instalação e inicializar o servidor a API fica disponível na rota abaixo:

```sh
http://localhost:4000/graphql
```

---

## Modelo de requisições

O arquivo **./request-examples.json** contém rexemplos de todas as requisições disponíveis na API.

As respostas da maioria das requisições são **Union types**. O objetivo é trabalhar melhor com os possíveis erros de cada requisição. Seguem os exemplos:

```sh
## Request
query {
  account(id: "00000000-0000-0000-0000-000000000001") {
    ... on Account {
      id
      name
      email
      slug
      isActive
      createdAt
      updatedAt
    }
    ... on ErrorResult {
      errors {
        message
        code
        field
      }
    }
  }
}
```

```sh
## Successful resquest
{
  "data": {
    "account": {
      "id": "00000000-0000-0000-0000-000000000001",
      "name": "Aurora",
      "email": "aurora@aurora.com",
      "slug": "aurora",
      "isActive": true,
      "createdAt": "2020-09-21T17:20:41.000Z",
      "updatedAt": "2020-09-21T17:20:41.000Z"
    }
  }
}
```

```sh
## Bad resquest
{
  "data": {
    "account": {
      "errors": [
        {
          "message": "Not found",
          "code": "404",
          "field": "id"
        }
      ]
    }
  }
}
```

Os erros de autenticação e de servidor são retornados no formato padrão do GraphQL.

```sh
# Request Error
{
  "errors": [
    {
      "message": "Access denied! You don't have permission for this action!",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "meAccount"
      ],


      # ...


    }
  ],
  "data": {
    "meAccount": null
  }
}
```
