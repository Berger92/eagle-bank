import { randomInt } from "node:crypto";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Currency } from "@prisma/client";
import { CreateBankAccountRequest, BankAccountResponse } from "./dto";
import { AccountRepository } from "./account.repository";
import { ListBankAccountsResponse } from "@v1/account/dto/list-accounts-response.dto";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(input: CreateBankAccountRequest, userId: string): Promise<BankAccountResponse> {
    const accountNumber = `01${randomInt(100000, 999999).toString()}`;
    const sortCode = "10-10-10";
    const balance = 0.0;
    const currency = Currency.GBP;

    const account = await this.accountRepository.create({
      ownerId: userId,
      accountNumber,
      sortCode,
      balance,
      currency,
      name: input.name,
      accountType: input.accountType,
    });

    return BankAccountResponse.fromEntity(account);
  }

  async getAccountIfOwned(accountNumber: string, userId: string): Promise<BankAccountResponse> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);

    if (!account) throw new NotFoundException();
    if (account.ownerId !== userId) throw new ForbiddenException();

    return BankAccountResponse.fromEntity(account);
  }

  async findAllUserAccounts(userId: string): Promise<ListBankAccountsResponse> {
    const accounts = await this.accountRepository.findAllByUser(userId);

    return ListBankAccountsResponse.fromEntities(accounts);
  }
}
