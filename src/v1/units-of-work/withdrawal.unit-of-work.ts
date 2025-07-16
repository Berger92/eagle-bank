import { Injectable } from "@nestjs/common";
import { BankAccount, Transaction } from "@prisma/client";
import { PrismaService } from "@shared/services";
import { CreateTransactionRequest, TransactionService } from "../modules/transaction";

@Injectable()
export class WithdrawalUnitOfWork {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(
    userId: string,
    accountId: string,
    dto: CreateTransactionRequest,
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const accounts = await tx.$queryRaw<
        BankAccount[]
      >`SELECT * FROM "BankAccount" WHERE id = ${accountId} FOR UPDATE`;
      const account = accounts[0];

      if (!account) {
        throw new Error("Invariant violated: account not found during locked query.");
      }

      if (account.balance.toNumber() < dto.amount) {
        throw new Error("Invariant violated: balance insufficient after lock.");
      }

      await tx.bankAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: dto.amount,
          },
        },
      });

      const transactionInput = this.transactionService.createTransactionInputFromDto(
        userId,
        accountId,
        dto,
      );

      return tx.transaction.create({
        data: transactionInput,
      });
    });
  }
}
