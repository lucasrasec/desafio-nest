# Projeto NestJS com Prisma e Validação de Autenticação

Este é um projeto básico utilizando NestJS, Prisma, validação de entrada e autenticação via token.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)
- [Licença](#licença)

## Instalação

Para começar, clone este repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
```

## Executar

Após isso é preciso subir o container do banco:

```bash
docker-compose up -d
```

Executar as migrations do prisma:

```bash
npx prisma migrate dev
```

Iniciar a aplicação:

```bash
npm run start:dev
```

## Testes da aplicação

A aplicação pode ser testada a partir do: api.http
(Atravez da extenção REST Client do vscode)

## Autenticação

Todas as requisições devem incluir o cabeçalho X-Api-Token com o valor do token definido no .env.


