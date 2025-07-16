# Eagle Bank – Technical Details

This document outlines key architectural decisions, implementation strategies, and trade-offs made while developing the Eagle Bank API.

---

## 🧱 Architecture

- **Monorepo Structure** (Flat modular layout)
  - `auth/`, `users/`, `accounts/`, `transactions/`
- **NestJS** for DI, validation, decorators, middleware pipeline
- **Prisma** as DB access layer — provides type safety and dev-friendly tooling
- **Unit of work** pattern for cross-cutting db operations
---

## ✅ Code-First API Design

- Chosen over OpenAPI codegen to maintain flexibility and code readability
- Swagger decorators (`@nestjs/swagger`) generate API docs dynamically
- Maintains tight alignment with the provided `openapi.yaml` through DTO constraints

---

## 🔐 Security

- **Passport-local strategy** for login
- **Passport-jwt strategy** for all secured routes
- All endpoints (except user sign-up) require a valid bearer token
- Forbidden access and resource scoping enforced via:
  - Route Guards
  - Account/User ownership checks
- Input validation using `class-validator` decorators

---

## 🔁 Concurrency & Consistency

- **Row-level locking (FOR UPDATE)** ensures consistency during withdrawals
- Prevents race conditions and negative balances when concurrent transactions occur

---

## 🧪 Testing Strategy

- **End-to-end tests** with `supertest` and Jest
- Follows BDD-style test names and expectations as per task scenarios
- Tests cover:
  - Auth
  - Create/Read for users
  - Create/Read for accounts
  - Create/Read for Transactions
  - Access control and error cases
- Uses the same docker container for simplicity

---

## 📎 References

- [NestJS Documentation](https://docs.nestjs.com/)
- [OpenAPI Spec](./openapi.yaml)
- [Prisma Schema](./prisma/schema.prisma)

