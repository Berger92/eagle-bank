import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateTransactionRequest } from "@v1/modules/transaction";
import { TransactionType } from "@v1/modules/transaction/types";
import { Currency } from "@v1/modules/account";
import { createUserAndLogin, createTestApp, createBankAccount } from "../../utils";

describe("POST /v1/accounts/{accountNumber}/transactions (Create Transaction)", () => {
  let app: INestApplication;
  let accessToken: string;
  let accountNumber: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken } = await createUserAndLogin(app));
    ({ accountNumber } = await createBankAccount(app, accessToken));
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Given a user wants to deposit money into their bank account", () => {
    it("When the user POSTs a valid deposit transaction, Then it should be created successfully", async () => {
      const payload: CreateTransactionRequest = {
        type: TransactionType.DEPOSIT,
        amount: 100.0,
        currency: Currency.GBP,
        reference: "Initial deposit",
      };

      const res = await request(app.getHttpServer())
        .post(`/v1/accounts/${accountNumber}/transactions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(payload)
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.id).toMatch(/^tan-/);
      expect(res.body.userId).toMatch(/^usr-/);
      expect(res.body.amount).toBe(payload.amount);
      expect(res.body.currency).toBe(payload.currency);
      expect(res.body.type).toBe(payload.type);
    });

    it("Then the account balance should reflect the deposit", async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumber}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.balance).toBe(100.0);
    });
  });

  describe("Given a user wants to withdraw money with insufficient funds", () => {
    it("When the user withdraws within balance, Then it should succeed", async () => {
      const payload: CreateTransactionRequest = {
        type: TransactionType.WITHDRAWAL,
        amount: 40.0,
        currency: Currency.GBP,
        reference: "Normal withdrawal",
      };

      const res = await request(app.getHttpServer())
        .post(`/v1/accounts/${accountNumber}/transactions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(payload)
        .expect(201);

      expect(res.body.type).toBe(TransactionType.WITHDRAWAL);
      expect(res.body.amount).toBe(40);
    });

    it("Then the account balance should reflect the withdrawal", async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumber}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.balance).toBe(60);
    });

    it("When the withdrawal exceeds balance, Then the system returns Unprocessable Entity", async () => {
      const payload: CreateTransactionRequest = {
        type: TransactionType.WITHDRAWAL,
        amount: 5000.0,
        currency: Currency.GBP,
        reference: "Overspend attempt",
      };

      await request(app.getHttpServer())
        .post(`/v1/accounts/${accountNumber}/transactions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(payload)
        .expect(422);
    });
  });
});
