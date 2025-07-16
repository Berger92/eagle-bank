import { Injectable } from "@nestjs/common";
import { Prisma, Transaction } from "@prisma/client";
import { UserMapper } from "@v1/modules/user/user.mapper";
import { Currency } from "@v1/modules/account";
import { CreateTransactionRequest, TransactionResponse } from "./dto";
import { TransactionType } from "@v1/modules/transaction/types";

@Injectable()
export class TransactionMapper {
  constructor(private readonly userMapper: UserMapper) {}

  formatExternalId(internalId: string): string {
    return `tan-${internalId}`;
  }

  parseInternalId(externalId: string): string {
    if (!externalId.startsWith("tan-")) {
      throw new Error(`Invalid external transaction ID: ${externalId}`);
    }
    return externalId.slice(4);
  }

  createPrismaInputFromDto(
    userId: string,
    accountId: string,
    dto: CreateTransactionRequest,
  ): Prisma.TransactionCreateInput {
    const id = crypto.randomUUID();
    const externalId = this.formatExternalId(id);

    return {
      id,
      externalId,
      currency: dto.currency,
      user: { connect: { id: userId } },
      account: { connect: { id: accountId } },
      type: dto.type,
      amount: dto.amount,
      reference: dto.reference,
    };
  }

  toResponseDto(entity: Transaction): TransactionResponse {
    return {
      id: entity.externalId,
      amount: entity.amount.toNumber(),
      currency: entity.currency as Currency,
      type: entity.type as TransactionType,
      reference: entity.reference || undefined,
      userId: this.userMapper.formatExternalId(entity.userId),
      createdTimestamp: entity.createdAt.toISOString(),
    };
  }
}
