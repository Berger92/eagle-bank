import { ApiProperty } from "@nestjs/swagger";
import { Transaction } from "@prisma/client";
import { TransactionResponse } from "./transaction-response.dto";

export class ListTransactionResponse {
  @ApiProperty({
    description: "List of transactions for the account",
    type: [TransactionResponse],
  })
  transactions: TransactionResponse[];

  static fromEntities(transactions: Transaction[]): ListTransactionResponse {
    const response = new ListTransactionResponse();
    response.transactions = transactions.map(TransactionResponse.fromEntity);
    return response;
  }
}
