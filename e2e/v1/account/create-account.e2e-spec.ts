import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AccountType, CreateBankAccountRequest } from "@v1/modules/account";
import { createUserAndLogin, createTestApp } from "../../utils";

describe("POST /v1/accounts (Create Account)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    ({ accessToken } = await createUserAndLogin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new bank account when request is valid", async () => {
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

  it('should return 400 when "name" is missing', async () => {
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

  it("should return 401 when user is unauthenticated", async () => {
    const body: CreateBankAccountRequest = {
      name: "Unauthorized",
      accountType: AccountType.PERSONAL,
    };

    await request(app.getHttpServer()).post("/v1/accounts").send(body).expect(401);
  });
});
