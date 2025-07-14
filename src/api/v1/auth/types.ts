import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";

export interface JwtPayload extends BaseJwtPayload {
  sub: string;
  env: "development" | "staging" | "production";
}
