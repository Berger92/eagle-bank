import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { makeUserDto } from "../factories/user.factory";

export const createUserAndLogin = async (app: INestApplication) => {
  const userDto = makeUserDto();

  await request(app.getHttpServer()).post("/v1/users").send(userDto).expect(201);

  const loginRes = await request(app.getHttpServer())
    .post("/v1/auth/login")
    .send({ username: userDto.username, password: userDto.password })
    .expect(201);

  return { accessToken: loginRes.body.access_token };
};
