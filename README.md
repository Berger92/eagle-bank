# Eagle Bank API

A secure REST API for managing users, bank accounts, and transactions, built with NestJS, Prisma, and PostgreSQL.

---

## 🚀 Features

- User sign-up, authentication (JWT-based)
- Create and read operations on users and bank accounts
- Money deposits and withdrawals
- E2E test suite with BDD-style specs using Supertest
- Row-level locking to ensure consistency on withdrawals

---

## 🛠️ Tech Stack

- **Framework:** NestJS (code-first)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Passport (Local + JWT)
- **Testing:** Jest + Supertest
- **Docs:** `@nestjs/swagger`

The swagger page is automatically generated and available at http://localhost:3000/api

The database can be easily inspected using Prisma Studio: `yarn prisma studio`

There are more technical details in the [DETAILS.md](./DETAILS.md) file.

---

## ⚙️ Setup

Start the PostgreSQL database server with Docker Compose
```
docker compose up -d
```

Use NodeJS v22.17
```
nvm use
```

Enable corepack to use Yarn
```
corepack enable
```

Install dependencies
```
yarn install
```

Run migrations to set up the database schema
```
yarn prisma migrate dev
```

Start the dev server
```
yarn start:dev
```

Run End-to-End tests (Requires the Docker container to be running)
```
yarn test:e2e
```