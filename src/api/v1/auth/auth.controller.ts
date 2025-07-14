import { Controller, Req, Post, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { Public } from "@shared/decorators/public.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./dto/login.dto";

@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @Public()
  @ApiOperation({
    summary: "Login user",
    description: "Authenticates a user and returns the access token.",
  })
  @ApiBody({ type: LoginRequest })
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
