import { ApiProperty } from "@nestjs/swagger";
import { Transaction } from "@prisma/client";
import { Currency } from "@v1/account";
import { formatExternalId } from "@v1/user";
import { TransactionType } from "../types";

export class TransactionResponse {
  @ApiProperty({ example: "tan-123abc", pattern: "^tan-[A-Za-z0-9]+$" })
  id: string;

  @ApiProperty({ example: 100.0, minimum: 0, maximum: 10000, type: Number })
  amount: number;

  @ApiProperty({ enum: Currency })
  currency: Currency;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ example: "Test reference", required: false })
  reference?: string;

  @ApiProperty({ example: "usr-abc123", pattern: "^usr-[A-Za-z0-9]+$", required: false })
  userId?: string;

  @ApiProperty({ example: "2025-07-15T12:34:56.000Z", format: "date-time" })
  createdTimestamp: string;

  static fromEntity(entity: Transaction): TransactionResponse {
    const dto = new TransactionResponse();
    dto.id = entity.externalId;
    dto.amount = entity.amount.toNumber();
    dto.currency = entity.currency as Currency;
    dto.type = entity.type as TransactionType;
    dto.reference = entity.reference ?? undefined;
    dto.userId = formatExternalId(entity.userId);
    dto.createdTimestamp = entity.createdAt.toISOString();
    return dto;
  }
}
