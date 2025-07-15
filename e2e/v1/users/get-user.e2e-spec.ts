import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createTestApp } from "../../utils/create-app";
import { makeUserDto } from "../../factories/user.factory";

describe("Fetch a user", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Scenario: User wants to fetch their user details", () => {
    it("Given a user is authenticated, When they request their own userId, Then the system returns the user details", async () => {
      const userDto = makeUserDto();

      const createRes = await request(app.getHttpServer()).post("/v1/users").send(userDto);

      const loginRes = await request(app.getHttpServer()).post("/v1/auth/login").send({
        username: userDto.username,
        password: userDto.password,
      });

      const token = loginRes.body.access_token;

      const res = await request(app.getHttpServer())
        .get(`/v1/users/${createRes.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty("id", createRes.body.id);
      expect(res.body.email).toBe(userDto.email);
    });
  });

  describe("Scenario: User wants to fetch the user details of another user", () => {
    it("Given a user is authenticated, When they request another user's userId, Then the system returns 403 Forbidden", async () => {
      const userA = makeUserDto();
      const userB = makeUserDto();

      const resA = await request(app.getHttpServer()).post("/v1/users").send(userA);
      const resB = await request(app.getHttpServer()).post("/v1/users").send(userB);

      const loginB = await request(app.getHttpServer())
        .post("/v1/auth/login")
        .send({ username: userB.username, password: userB.password });

      await request(app.getHttpServer())
        .get(`/v1/users/${resA.body.id}`)
        .set("Authorization", `Bearer ${loginB.body.access_token}`)
        .expect(403);
    });
  });

  describe("Scenario: Request without authentication", () => {
    it("Given no authentication header, When the user requests their details, Then the system returns 401 Unauthorized", async () => {
      await request(app.getHttpServer()).get("/v1/users/usr-unauthorized").expect(401);
    });
  });
});
