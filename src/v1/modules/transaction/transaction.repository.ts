import { Injectable } from "@nestjs/common";
import { Prisma, Transaction } from "@prisma/client";
import { PrismaService } from "@shared/services";

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: Prisma.TransactionCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: input,
    });
  }

  async findAllTransactionsForAccount(accountId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(transactionId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });
  }
}
