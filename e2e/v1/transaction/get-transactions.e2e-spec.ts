import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createUserAndLogin } from "../../utils/create-user-and-login";
import { createTestApp } from "../../utils/create-app";
import { createBankAccount } from "../../utils/create-bank-account";

describe("GET /v1/accounts/{accountNumber}/transactions/(:transactionId)", () => {
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

  describe("Given a user wants to list transactions on their account", () => {
    it("When the user GETs transactions, Then the system returns the list", async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumber}/transactions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body.transactions)).toBe(true);
    });
  });

  describe("Given a user wants to fetch a specific transaction", () => {
    let transactionId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/accounts/${accountNumber}/transactions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          type: "deposit",
          amount: 75,
          currency: "GBP",
          reference: "Target transaction",
        })
        .expect(201);

      transactionId = res.body.id;
    });

    it("When the user GETs by transaction ID, Then the system returns the transaction", async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumber}/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.id).toBe(transactionId);
    });
  });
});
