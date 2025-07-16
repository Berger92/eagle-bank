import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "../../account";
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
}
