import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createUserAndLogin } from "../../utils/create-user-and-login";
import { createTestApp } from "../../utils/create-app";

describe("GET /v1/accounts (List & Fetch Account)", () => {
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

    // Create two accounts
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

  it("should return all accounts belonging to the authenticated user", async () => {
    const res = await request(app.getHttpServer())
      .get("/v1/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const accounts = res.body.accounts;

    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThanOrEqual(2);
    for (const accNum of accountNumbers) {
      expect(accounts.map((account: any) => account.accountNumber)).toContain(accNum);
    }
  });

  it("should fetch a specific account by account number", async () => {
    const res = await request(app.getHttpServer())
      .get(`/v1/accounts/${accountNumbers[0]}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.accountNumber).toBe(accountNumbers[0]);
    expect(res.body.name).toBeDefined();
    expect(res.body.balance).toBeDefined();
  });

  it("should return 403 when accessing another user's account", async () => {
    await request(app.getHttpServer())
      .get(`/v1/accounts/${accountNumbers[0]}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403);
  });

  it("should return 404 when accessing a non-existent account", async () => {
    await request(app.getHttpServer())
      .get("/v1/accounts/01999999")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);
  });

  it("should return 401 when user is unauthenticated", async () => {
    await request(app.getHttpServer()).get(`/v1/accounts/${accountNumbers[0]}`).expect(401);
  });
});
