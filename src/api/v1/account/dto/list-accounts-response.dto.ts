import { ApiProperty } from "@nestjs/swagger";
import { BankAccount } from "@prisma/client";
import { BankAccountResponse } from "./account-response.dto";

export class ListBankAccountsResponse {
  @ApiProperty({
    description: "List of bank accounts belonging to the user",
    type: [BankAccountResponse],
  })
  accounts: BankAccountResponse[];

  static fromEntities(accounts: BankAccount[]): ListBankAccountsResponse {
    const response = new ListBankAccountsResponse();
    response.accounts = accounts.map(BankAccountResponse.fromEntity);
    return response;
  }
}
