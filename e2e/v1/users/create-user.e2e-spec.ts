import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "../../utils/create-app";
import { makeUserDto } from "../../factories/user.factory";

describe("Create User (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Given valid signup data", () => {
    it("When POST /v1/users is called, Then it should return 201 and the new user object", async () => {
      const userDto = makeUserDto();

      const res = await request(app.getHttpServer()).post("/v1/users").send(userDto).expect(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^usr-/),
          name: userDto.name,
          email: userDto.email,
          phoneNumber: userDto.phoneNumber,
          address: expect.any(Object),
        }),
      );

      expect(res.body.createdTimestamp).toBeDefined();
      expect(new Date(res.body.createdTimestamp).toString()).not.toBe("Invalid Date");
    });
  });

  describe("Given missing required fields", () => {
    it("When POST /v1/users is called with missing fields, Then it should return 400 Bad Request", async () => {
      const res = await request(app.getHttpServer())
        .post("/v1/users")
        .send({}) // Empty payload
        .expect(400);

      const messages = res.body.message;

      expect(Array.isArray(messages)).toBe(true);

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.stringContaining("name should not be empty"),
          expect.stringContaining("username must be longer than or equal to 4 characters"),
          expect.stringContaining("password must be longer than or equal to 8 characters"),
          expect.stringContaining("address should not be empty"),
          expect.stringContaining("phoneNumber must be in valid E.164 format"),
          expect.stringContaining("email must be an email"),
        ]),
      );
    });
  });
});
