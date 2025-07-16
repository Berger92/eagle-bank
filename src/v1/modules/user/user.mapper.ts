import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserResponse } from "./dto";

@Injectable()
export class UserMapper {
  formatExternalId(internalId: string): string {
    return `usr-${internalId}`;
  }

  parseInternalId(externalId: string): string {
    if (!externalId.startsWith("usr-")) {
      throw new Error(`Invalid external user ID: ${externalId}`);
    }
    return externalId.slice(4);
  }

  toResponseDto(user: User): UserResponse {
    const dto = new UserResponse();

    dto.id = user.externalId;
    dto.name = user.name;
    dto.phoneNumber = user.phoneNumber;
    dto.email = user.email;
    dto.createdTimestamp = user.createdAt.toISOString();
    dto.updatedTimestamp = user.updatedAt.toISOString();
    dto.address = {
      line1: user.addressLine1,
      line2: user.addressLine2 || undefined,
      line3: user.addressLine3 || undefined,
      town: user.town,
      county: user.county,
      postcode: user.postcode,
    };

    return dto;
  }
}
