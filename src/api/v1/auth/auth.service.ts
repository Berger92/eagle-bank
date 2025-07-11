import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@v1/user";
import { PasswordService } from "@common/services";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
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

  async login(user: any) {
    const payload = { username: user.username, sub: user.externalId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
