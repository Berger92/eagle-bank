import { Body, Controller, Get, Param, Patch, Post, Delete } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { CreateBankAccountRequest } from "./dto";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { AuthenticatedUser } from "@shared/types";
import { BankAccountResponse } from "@v1/account/dto/account-response.dto";
import { ListBankAccountsResponse } from "@v1/account/dto/list-accounts-response.dto";

@ApiTags("account")
@ApiBearerAuth()
@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: "Create a new bank account" })
  @ApiBody({ type: CreateBankAccountRequest })
  @ApiCreatedResponse({
    description: "Bank account has been created successfully",
    type: BankAccountResponse,
  })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createAccountDto: CreateBankAccountRequest,
  ): Promise<BankAccountResponse> {
    return this.accountService.create(createAccountDto, user.internalId);
  }

  @Get()
  @ApiOperation({ summary: "List all bank accounts for the authenticated user" })
  @ApiOkResponse({ description: "List of bank accounts", type: ListBankAccountsResponse })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<ListBankAccountsResponse> {
    return this.accountService.findAllUserAccounts(user.internalId);
  }

  @Get(":accountNumber")
  @ApiOperation({ summary: "Fetch bank account by account number" })
  @ApiParam({ name: "accountNumber", example: "01234567", schema: { pattern: "^01\\d{6}$" } })
  @ApiOkResponse({ description: "Account found", type: BankAccountResponse })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiForbiddenResponse({ description: "User is not allowed to access this account" })
  @ApiNotFoundResponse({ description: "Account not found" })
  @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("accountNumber") accountNumber: string,
  ): Promise<BankAccountResponse> {
    return this.accountService.getAccountIfOwned(accountNumber, user.internalId);
  }

  // @Patch(":accountNumber")
  // @ApiOperation({ summary: "Update a bank account" })
  // @ApiParam({ name: "accountNumber", example: "01234567", schema: { pattern: "^01\\d{6}$" } })
  // @ApiOkResponse({ description: "Account updated" })
  // @ApiBadRequestResponse({ description: "Invalid request body or params" })
  // @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  // @ApiForbiddenResponse({ description: "User is not allowed to update this account" })
  // @ApiNotFoundResponse({ description: "Account not found" })
  // @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  // update(
  //   @Param("accountNumber") accountNumber: string,
  //   @Body() updateAccountDto: Partial<CreateBankAccountRequest>,
  // ) {
  //   return this.accountService.update(accountNumber, updateAccountDto);
  // }

  // @Delete(":accountNumber")
  // @ApiOperation({ summary: "Delete a bank account" })
  // @ApiParam({ name: "accountNumber", example: "01234567", schema: { pattern: "^01\\d{6}$" } })
  // @ApiNoContentResponse({ description: "Account successfully deleted" })
  // @ApiBadRequestResponse({ description: "Invalid account number" })
  // @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  // @ApiForbiddenResponse({ description: "User is not allowed to delete this account" })
  // @ApiNotFoundResponse({ description: "Account not found" })
  // @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  // remove(@Param("accountNumber") accountNumber: string) {
  //   return this.accountService.remove(accountNumber);
  // }
}
