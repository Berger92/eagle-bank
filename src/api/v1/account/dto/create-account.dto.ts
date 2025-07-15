import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { AccountType } from "../types";

export class CreateBankAccountRequest {
  @ApiProperty({
    description: "The display name of the bank account",
    example: "My Personal Account",
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  name: string;

  @ApiProperty({
    description: "The type of the bank account",
    enum: AccountType,
    example: "personal",
  })
  @IsEnum(AccountType)
  accountType: AccountType;
}
