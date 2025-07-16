import { ApiProperty } from "@nestjs/swagger";
import { BankAccountResponse } from "./account-response.dto";

export class ListBankAccountsResponse {
  @ApiProperty({
    description: "List of bank accounts belonging to the user",
    type: [BankAccountResponse],
  })
  accounts: BankAccountResponse[];
}
