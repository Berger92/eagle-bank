import { Controller, Get, UseGuards, Req, Param } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get("/:userId")
  @ApiOperation({ summary: "Fetch user by ID" })
  getUserById(@Req() req: Request, @Param("userId") userId: string): string {
    // TODO - check if userId matches req.user.userId
    return req.user;
  }
}
