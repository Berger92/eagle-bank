import { Controller, Get, Param, Body, Post, ForbiddenException } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@shared/decorators/public.decorator";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthenticatedUser } from "@shared/types";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:userId")
  @ApiOperation({ summary: "Fetch user by ID" })
  getUserById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("userId") userId: string,
  ): AuthenticatedUser {
    if (user.externalId !== userId) {
      throw new ForbiddenException();
    }

    // TODO - lookup user from database
    return user;
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
