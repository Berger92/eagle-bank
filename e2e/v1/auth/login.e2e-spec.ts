import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createTestApp } from "../../utils";
import { makeUserDto } from "../../factories/user.factory";

describe("Authenticate a user", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Scenario: User logs in with valid credentials", () => {
    it("Given a registered user, When they submit correct login credentials, Then a JWT token is returned", async () => {
      const userDto = makeUserDto();

      await request(app.getHttpServer()).post("/v1/users").send(userDto).expect(201);

      const res = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: userDto.username,
          password: userDto.password,
        })
        .expect(201);

      expect(res.body).toHaveProperty("access_token");
    });
  });

  describe("Scenario: User logs in with invalid credentials", () => {
    it("Given no matching user, When credentials are incorrect, Then a 401 Unauthorized is returned", async () => {
      await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({
          username: "wronguser",
          password: "wrongpass",
        })
        .expect(401);
    });
  });
});
