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

export class CreateUserAddressDto {
  @IsString()
  @IsNotEmpty()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  line3?: string;

  @IsString()
  @IsNotEmpty()
  town: string;

  @IsString()
  @IsNotEmpty()
  county: string;

  @IsString()
  @IsNotEmpty()
  postcode: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address: CreateUserAddressDto;

  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: "phoneNumber must be in valid E.164 format",
  })
  phoneNumber: string;

  @IsEmail()
  email: string;
}
