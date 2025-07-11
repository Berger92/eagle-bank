import { Controller, Get, Req, Param } from "@nestjs/common";
import { Request } from "express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  @Get("/:userId")
  @ApiOperation({ summary: "Fetch user by ID" })
  getUserById(@Req() req: Request, @Param("userId") userId: string): string {
    // TODO - check if userId matches req.user.userId
    return req.user;
  }
}
