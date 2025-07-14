import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserResponseAddress {
  @ApiProperty()
  line1: string;

  @ApiProperty()
  line2?: string;

  @ApiProperty()
  line3?: string;

  @ApiProperty()
  town: string;

  @ApiProperty()
  county: string;

  @ApiProperty()
  postcode: string;
}

export class UserResponse {
  @ApiProperty({ example: "usr-abc123" })
  id: string;

  @ApiProperty({ example: "Test User" })
  name: string;

  @ApiProperty({ type: UserResponseAddress })
  address: UserResponseAddress;

  @ApiProperty({ example: "+441234567890" })
  phoneNumber: string;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "2025-07-14T20:34:40.153Z" })
  createdTimestamp: string;

  @ApiProperty({ example: "2025-07-14T20:34:40.153Z" })
  updatedTimestamp: string;

  static fromEntity(user: User): UserResponse {
    const dto = new UserResponse();

    dto.id = user.id;
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
