import { Controller, Get, Req, Param, Body, Post, ForbiddenException } from "@nestjs/common";
import { Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../../../shared/decorators/public.decorator";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:userId")
  @ApiOperation({ summary: "Fetch user by ID" })
  getUserById(@Req() req: Request, @Param("userId") userId: string): string {
    if (req.user.externalId !== userId) {
      throw new ForbiddenException();
    }

    // TODO - lookup user from database
    return req.user;
  }

  @Post()
  @Public()
  @ApiOperation({
    summary: "Create new user",
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    const { password, ...rest } = user;

    return rest;
  }
}
