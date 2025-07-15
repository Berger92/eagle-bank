import { Controller, Get, Param, Body, Post, ForbiddenException } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { Public } from "@shared/decorators/public.decorator";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { UserService } from "./user.service";
import { CreateUserRequest, UserResponse } from "./dto";
import { AuthenticatedUser } from "@shared/types";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:userId")
  @ApiOperation({ summary: "Fetch user by ID" })
  @ApiOkResponse({
    description: "The user details",
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiNotFoundResponse({ description: "User was not found" })
  async getUserById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("userId") userId: string,
  ): Promise<UserResponse> {
    if (user.externalId !== userId) {
      throw new ForbiddenException();
    }

    return this.userService.findByExternalId(user.externalId);
  }

  @Post()
  @Public()
  @ApiOperation({
    summary: "Create new user",
  })
  @ApiBody({ type: CreateUserRequest })
  @ApiCreatedResponse({
    description: "User has been created successfully",
    type: UserResponse,
  })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  async createUser(@Body() body: CreateUserRequest): Promise<UserResponse> {
    return this.userService.create(body);
  }
}
