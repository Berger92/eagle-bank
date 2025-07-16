import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/services";
import { AccountType, BankAccount, Currency, Prisma } from "@prisma/client";

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByAccountNumber(accountNumber: string): Promise<BankAccount | null> {
    return this.prisma.bankAccount.findUnique({
      where: { accountNumber },
    });
  }

  create(data: {
    ownerId: string;
    accountNumber: string;
    sortCode: string;
    name: string;
    accountType: AccountType;
    balance: number;
    currency: Currency;
  }): Promise<BankAccount> {
    return this.prisma.bankAccount.create({
      data,
    });
  }

  findAllByUser(userId: string): Promise<BankAccount[]> {
    return this.prisma.bankAccount.findMany({
      where: { ownerId: userId },
    });
  }

  incrementBalance(accountId: string, depositAmount: number): Promise<BankAccount> {
    return this.prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: depositAmount,
        },
      },
    });
  }
}
