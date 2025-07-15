import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateTransactionRequest } from "@v1/transaction";
import { TransactionType } from "@v1/transaction/types";
import { Currency } from "@v1/account";
import { createUserAndLogin } from "../../utils/create-user-and-login";
import { createTestApp } from "../../utils/create-app";
import { createBankAccount } from "../../utils/create-bank-account";

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
      expect(res.body.amount).toBe(payload.amount);
      expect(res.body.currency).toBe(payload.currency);
      expect(res.body.type).toBe(payload.type);
    });
  });

  describe("Given a user wants to withdraw money with insufficient funds", () => {
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
