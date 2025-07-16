import { Injectable } from "@nestjs/common";
import { BankAccount, Prisma, Transaction } from "@prisma/client";
import { PrismaService } from "@shared/services";

@Injectable()
export class WithdrawalUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    amount: number,
    accountId: string,
    transactionInput: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const accounts = await tx.$queryRaw<
        BankAccount[]
      >`SELECT * FROM "BankAccount" WHERE id = ${accountId} FOR UPDATE`;

      const account = accounts[0];
      if (!account) {
        throw new Error("Invariant violated: account not found during locked query.");
      }

      if (account.balance.toNumber() < amount) {
        throw new Error("Invariant violated: balance insufficient after lock.");
      }

      await tx.bankAccount.update({
        where: { id: accountId },
        data: {
          balance: { decrement: amount },
        },
      });

      return tx.transaction.create({ data: transactionInput });
    });
  }
}
