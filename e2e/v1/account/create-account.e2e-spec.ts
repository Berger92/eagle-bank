import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AccountType, CreateBankAccountRequest } from "@v1/modules/account";
import { createUserAndLogin, createTestApp } from "../../utils";

describe("POST /v1/accounts (Create Bank Account)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken } = await createUserAndLogin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Given an authenticated user", () => {
    it("When the user submits a valid account creation request, Then the system creates a new bank account", async () => {
      const body: CreateBankAccountRequest = {
        name: "My Main Account",
        accountType: AccountType.PERSONAL,
      };

      const res = await request(app.getHttpServer())
        .post("/v1/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .expect(201);

      expect(res.body).toHaveProperty("accountNumber");
      expect(res.body.accountType).toBe(body.accountType);
      expect(res.body.name).toBe(body.name);
      expect(res.body.balance).toBe(0);
      expect(res.body.currency).toBe("GBP");
    });

    it('When the user omits the "name" field, Then the system returns 400 Bad Request', async () => {
      const body = { accountType: "personal" };

      const res = await request(app.getHttpServer())
        .post("/v1/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining("name must be a string")]),
      );
    });
  });

  describe("Given an unauthenticated user", () => {
    it("When the user attempts to create a bank account, Then the system returns 401 Unauthorized", async () => {
      const body: CreateBankAccountRequest = {
        name: "Unauthorized",
        accountType: AccountType.PERSONAL,
      };

      await request(app.getHttpServer()).post("/v1/accounts").send(body).expect(401);
    });
  });
});
