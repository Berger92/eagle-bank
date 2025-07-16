import * as crypto from "node:crypto";
import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Prisma, Transaction } from "@prisma/client";
import { AccountService } from "../account";
import { TransactionRepository } from "./transaction.repository";
import { CreateTransactionRequest } from "./dto";
import { TransactionType } from "./types";
import { formatExternalId, parseInternalId } from "./utils";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountService: AccountService,
  ) {}

  async create(
    accountNumber: string,
    userId: string,
    dto: CreateTransactionRequest,
  ): Promise<Transaction> {
    const account = await this.accountService.getAccountIfOwned(accountNumber, userId);

    if (dto.type === TransactionType.WITHDRAWAL && account.balance.toNumber() < dto.amount) {
      throw new UnprocessableEntityException("Insufficient funds");
    }

    const input = this.createTransactionInputFromDto(userId, account.id, dto);

    const transaction = await this.transactionRepository.create(input);

    const amountDelta = dto.type === TransactionType.DEPOSIT ? dto.amount : -dto.amount;
    await this.accountService.updateBalance(account.id, amountDelta);

    return transaction;
  }

  createTransactionInputFromDto(
    userId: string,
    accountId: string,
    dto: CreateTransactionRequest,
  ): Prisma.TransactionCreateInput {
    const uuid = crypto.randomUUID();
    const externalId = formatExternalId(uuid);

    return {
      id: uuid,
      externalId,
      currency: dto.currency,
      user: { connect: { id: userId } },
      account: { connect: { id: accountId } },
      type: dto.type,
      amount: dto.amount,
      reference: dto.reference,
    };
  }

  async findAllForAccount(accountNumber: string, userId: string): Promise<Transaction[]> {
    const account = await this.accountService.getAccountIfOwned(accountNumber, userId);

    const transactions = await this.transactionRepository.findAllTransactionsForAccount(account.id);
    return transactions;
  }

  async findByExternalId(
    accountNumber: string,
    userId: string,
    externalId: string,
  ): Promise<Transaction> {
    const account = await this.accountService.getAccountIfOwned(accountNumber, userId);

    const internalId = parseInternalId(externalId);

    const transaction = await this.transactionRepository.findById(internalId);
    if (!transaction || transaction.accountId !== account.id) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }
}
