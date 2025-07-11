import { Controller, Req, Post, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiOperation({ summary: "Login user", description: "Authenticates a user and returns the user object." })
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
