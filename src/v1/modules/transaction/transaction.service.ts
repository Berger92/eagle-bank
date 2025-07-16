import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { BankAccount, Transaction } from "@prisma/client";
import { WithdrawalUnitOfWork } from "@v1/modules/units-of-work/withdrawal.unit-of-work";
import { AccountService } from "@v1/modules/account";
import { TransactionRepository } from "./transaction.repository";
import { TransactionMapper } from "./transaction.mapper";
import { CreateTransactionRequest } from "./dto";
import { TransactionType } from "./types";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionMapper: TransactionMapper,
    private readonly accountService: AccountService,
    private readonly withdrawalUnitOfWork: WithdrawalUnitOfWork,
  ) {}

  async create(
    accountNumber: string,
    userId: string,
    dto: CreateTransactionRequest,
  ): Promise<Transaction> {
    const account = await this.accountService.getAccountIfOwned(accountNumber, userId);

    if (dto.type === TransactionType.WITHDRAWAL) {
      return this.createWithdrawal(userId, account, dto);
    } else {
      return this.createDeposit(userId, account.id, dto);
    }
  }

  async createWithdrawal(
    userId: string,
    account: BankAccount,
    dto: CreateTransactionRequest,
  ): Promise<Transaction> {
    if (account.balance.toNumber() < dto.amount) {
      throw new UnprocessableEntityException("Insufficient funds");
    }

    const transactionInput = this.transactionMapper.createPrismaInputFromDto(
      userId,
      account.id,
      dto,
    );

    return this.withdrawalUnitOfWork.execute(dto.amount, account.id, transactionInput);
  }

  async createDeposit(
    userId: string,
    accountId: string,
    dto: CreateTransactionRequest,
  ): Promise<Transaction> {
    const input = this.transactionMapper.createPrismaInputFromDto(userId, accountId, dto);
    const transaction = await this.transactionRepository.create(input);
    await this.accountService.incrementBalance(accountId, dto.amount);

    return transaction;
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

    const internalId = this.transactionMapper.parseInternalId(externalId);

    const transaction = await this.transactionRepository.findById(internalId);
    if (!transaction || transaction.accountId !== account.id) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }
}
