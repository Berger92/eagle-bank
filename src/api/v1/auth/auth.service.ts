import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService, UserWithoutPassword } from "@v1/user";
import { PasswordService } from "@shared/services";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      const { password: hashedPassword, ...result } = user;

      const isPasswordValid = await this.passwordService.compare(password, hashedPassword);

      if (isPasswordValid) {
        return result;
      }
    }

    return null;
  }

  async login(user: UserWithoutPassword): Promise<{ access_token: string }> {
    const payload = {
      username: user.username,
      sub: user.externalId,
      env: this.configService.getOrThrow<string>("ENVIRONMENT"),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
