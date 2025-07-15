import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/services";
import { AccountType, BankAccount, Currency } from "@prisma/client";

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

  async incrementBalance(accountId: string, amountDelta: number): Promise<BankAccount> {
    return this.prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amountDelta,
        },
      },
    });
  }

  // update(accountNumber: string, updateAccountDto: Partial<CreateBankAccountRequest>) {
  //   // TODO: Implement update logic
  //   return `Account ${accountNumber} updated`;
  // }

  // remove(accountNumber: string) {
  //   // TODO: Implement delete logic
  //   return `Account ${accountNumber} deleted`;
  // }
}
