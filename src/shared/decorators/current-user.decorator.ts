import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthenticatedUser } from "@shared/types";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new InternalServerErrorException(
        "Authenticated user not found in request. Did you forget to apply the guard?",
      );
    }

    return request.user as AuthenticatedUser; // Passport attaches the user object here
  },
);
