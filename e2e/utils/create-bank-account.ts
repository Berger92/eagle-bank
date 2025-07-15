import * as request from "supertest";
import { INestApplication } from "@nestjs/common";

export const createBankAccount = async (app: INestApplication, accessToken: string) => {
  const response = await request(app.getHttpServer())
    .post("/v1/accounts")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "Test Account",
      accountType: "personal",
    })
    .expect(201);

  return { accountNumber: response.body.accountNumber };
};
