import { Injectable } from "@nestjs/common";
import { BankAccount } from "@prisma/client";
import { BankAccountResponse } from "./dto";
import { AccountType, Currency } from "./types";

@Injectable()
export class AccountMapper {
  toResponseDto(account: BankAccount): BankAccountResponse {
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
