import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthenticatedUser } from "@shared/types";
import { UserMapper } from "../../user";
import { JwtPayload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userMapper: UserMapper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const expectedEnv = this.configService.getOrThrow<string>("ENVIRONMENT");

    if (payload.env !== expectedEnv) {
      throw new UnauthorizedException("Token was issued for a different environment");
    }

    // NOTE: Shortcut – assumes externalId is in the form 'usr-<internalId>'.
    // This avoids a DB lookup for now, but may need to be replaced with one
    // if additional user fields are required (e.g., roles, status).

    const externalId = payload.sub;
    const internalId = this.userMapper.parseInternalId(externalId);

    return { externalId, internalId };
  }
}
