import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createAccountDto: CreateBankAccountRequest,
  ): Promise<BankAccountResponse> {
    const account = await this.accountService.create(createAccountDto, user.internalId);

    return BankAccountResponse.fromEntity(account);
  }

  @Get()
  @ApiOperation({ summary: "List all bank accounts for the authenticated user" })
  @ApiOkResponse({ description: "List of bank accounts", type: ListBankAccountsResponse })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async findAll(@CurrentUser() user: AuthenticatedUser): Promise<ListBankAccountsResponse> {
    const accounts = await this.accountService.findAllUserAccounts(user.internalId);

    return ListBankAccountsResponse.fromEntities(accounts);
  }

  @Get(":accountNumber")
  @ApiOperation({ summary: "Fetch bank account by account number" })
  @ApiParam({ name: "accountNumber", example: "01234567", schema: { pattern: "^01\\d{6}$" } })
  @ApiOkResponse({ description: "Account found", type: BankAccountResponse })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiForbiddenResponse({ description: "User is not allowed to access this account" })
  @ApiNotFoundResponse({ description: "Account not found" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("accountNumber") accountNumber: string,
  ): Promise<BankAccountResponse> {
    const account = await this.accountService.getAccountIfOwned(accountNumber, user.internalId);

    return BankAccountResponse.fromEntity(account);
  }
}
