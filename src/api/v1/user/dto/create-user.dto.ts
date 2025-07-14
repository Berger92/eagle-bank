import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRequestAddress {
  @ApiProperty({ description: "First line of the address" })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ description: "Second line of the address", required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ description: "Third line of the address", required: false })
  @IsOptional()
  @IsString()
  line3?: string;

  @ApiProperty({ description: "Town or city" })
  @IsString()
  @IsNotEmpty()
  town: string;

  @ApiProperty({ description: "County or state" })
  @IsString()
  @IsNotEmpty()
  county: string;

  @ApiProperty({ description: "Postal code" })
  @IsString()
  @IsNotEmpty()
  postcode: string;
}

export class CreateUserRequest {
  @ApiProperty({ description: "Full name of the user" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Username for the user", minLength: 4, maxLength: 32 })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @ApiProperty({ description: "Password for the user", minLength: 8, maxLength: 64 })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ApiProperty({ description: "Address of the user", type: CreateUserRequestAddress })
  @ValidateNested()
  @Type(() => CreateUserRequestAddress)
  address: CreateUserRequestAddress;

  @ApiProperty({ description: "Phone number in E.164 format", example: "+1234567890" })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: "phoneNumber must be in valid E.164 format",
  })
  phoneNumber: string;

  @ApiProperty({ description: "Email address of the user" })
  @IsEmail()
  email: string;
}
