import { ApiProperty } from "@nestjs/swagger";
import { TransactionResponse } from "./transaction-response.dto";

export class ListTransactionResponse {
  @ApiProperty({
    description: "List of transactions for the account",
    type: [TransactionResponse],
  })
  transactions: TransactionResponse[];
}
