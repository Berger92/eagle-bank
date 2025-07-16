import { ApiProperty } from "@nestjs/swagger";
import { AccountType, Currency } from "../types";
import { BankAccount } from "@prisma/client";

export class BankAccountResponse {
  @ApiProperty({
    description: "Bank account number",
    example: "01234567",
    pattern: "^01\\d{6}$",
  })
  accountNumber: string;

  @ApiProperty({
    description: "Sort code of the bank",
    enum: ["10-10-10"],
    example: "10-10-10",
  })
  sortCode: string;

  @ApiProperty({
    description: "Display name of the bank account",
    example: "My Primary Account",
  })
  name: string;

  @ApiProperty({
    description: "Type of the account",
    enum: AccountType,
    example: AccountType.PERSONAL,
  })
  accountType: AccountType;

  @ApiProperty({
    description: "Current balance in the account",
  })
  balance: number;

  @ApiProperty({
    description: "Currency of the account",
    enum: Currency,
    example: Currency.GBP,
  })
  currency: Currency;

  @ApiProperty({
    description: "Timestamp of account creation",
    example: "2025-07-15T10:00:00Z",
    format: "date-time",
  })
  createdTimestamp: string;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2025-07-15T11:00:00Z",
    format: "date-time",
  })
  updatedTimestamp: string;

  static fromEntity(account: BankAccount): BankAccountResponse {
    const dto = new BankAccountResponse();
    dto.accountNumber = account.accountNumber;
    dto.sortCode = account.sortCode;
    dto.name = account.name;
    dto.accountType = account.accountType as AccountType;
    dto.balance = account.balance.toNumber();
    dto.currency = account.currency as Currency;
    dto.createdTimestamp = account.createdAt.toISOString();
    dto.updatedTimestamp = account.updatedAt.toISOString();
    return dto;
  }
}
