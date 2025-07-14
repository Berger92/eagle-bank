import { Controller, Req, Post, UseGuards, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { Public } from "@shared/decorators/public.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { LoginRequest, LoginResponse } from "./dto/login.dto";

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully logged in.",
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials.",
  })
  async login(@Req() req: Request): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }
}
