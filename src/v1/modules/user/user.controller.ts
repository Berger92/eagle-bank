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
import { AuthenticatedUser } from "@shared/types";
import { UserService } from "./user.service";
import { CreateUserRequest, UserResponse } from "./dto";
import { UserMapper } from "./user.mapper";

@ApiTags("users")
@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

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

    const userEntity = await this.userService.findByExternalId(user.externalId);
    return this.userMapper.toResponseDto(userEntity);
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
    const user = await this.userService.create(body);

    return this.userMapper.toResponseDto(user);
  }
}
