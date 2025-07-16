import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createTestApp } from "../../utils";
import { makeUserDto } from "../../factories/user.factory";

describe("POST /v1/auth/login (Authenticate User)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Given a registered user", () => {
    it("When the user submits valid login credentials, Then the system returns a JWT token", async () => {
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
      expect(typeof res.body.access_token).toBe("string");
    });
  });

  describe("Given no matching user credentials", () => {
    it("When the user submits invalid login credentials, Then the system returns 401 Unauthorized", async () => {
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
