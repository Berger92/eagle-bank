import { randomInt } from "node:crypto";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { BankAccount, Currency } from "@prisma/client";
import { CreateBankAccountRequest } from "./dto";
import { AccountRepository } from "./account.repository";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(input: CreateBankAccountRequest, userId: string): Promise<BankAccount> {
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

    return account;
  }

  async getAccountIfOwned(accountNumber: string, userId: string): Promise<BankAccount> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);

    if (!account) throw new NotFoundException();
    if (account.ownerId !== userId) throw new ForbiddenException();

    return account;
  }

  async findAllUserAccounts(userId: string): Promise<BankAccount[]> {
    const accounts = await this.accountRepository.findAllByUser(userId);

    return accounts;
  }

  async incrementBalance(accountId: string, amountDelta: number): Promise<BankAccount> {
    return this.accountRepository.incrementBalance(accountId, amountDelta);
  }
}
