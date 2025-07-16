import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createUserAndLogin, createTestApp } from "../../utils";

describe("GET /v1/accounts (List & Fetch Bank Accounts)", () => {
  let app: INestApplication;
  let accessToken: string;
  let otherToken: string;
  let accountNumbers: string[] = [];

  beforeAll(async () => {
    app = await createTestApp();
    const { accessToken: tokenA } = await createUserAndLogin(app);
    const { accessToken: tokenB } = await createUserAndLogin(app);

    accessToken = tokenA;
    otherToken = tokenB;

    for (const name of ["Account A", "Account B"]) {
      const res = await request(app.getHttpServer())
        .post("/v1/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ name, accountType: "personal" })
        .expect(201);

      accountNumbers.push(res.body.accountNumber);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Given an authenticated user", () => {
    it("When the user lists their accounts, Then all of their bank accounts are returned", async () => {
      const res = await request(app.getHttpServer())
        .get("/v1/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const accounts = res.body.accounts;

      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThanOrEqual(2);

      for (const accNum of accountNumbers) {
        expect(accounts.map((a: any) => a.accountNumber)).toContain(accNum);
      }
    });

    it("When the user fetches one of their accounts by account number, Then the correct account details are returned", async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumbers[0]}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.accountNumber).toBe(accountNumbers[0]);
      expect(res.body.name).toBeDefined();
      expect(res.body.balance).toBeDefined();
    });
  });

  describe("Given a different authenticated user", () => {
    it("When the user fetches another user's account, Then the system returns 403 Forbidden", async () => {
      await request(app.getHttpServer())
        .get(`/v1/accounts/${accountNumbers[0]}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);
    });
  });

  describe("Given an authenticated user", () => {
    it("When the user fetches a non-existent account, Then the system returns 404 Not Found", async () => {
      await request(app.getHttpServer())
        .get("/v1/accounts/01999999")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe("Given no authentication", () => {
    it("When the user fetches an account, Then the system returns 401 Unauthorized", async () => {
      await request(app.getHttpServer()).get(`/v1/accounts/${accountNumbers[0]}`).expect(401);
    });
  });
});
